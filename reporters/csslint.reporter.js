const Reporter = require('./reporter'),
  csslint = require('csslint').CSSLint,
  glob = require('glob'),
  fs = require('fs');

module.exports = class CSSReporter extends Reporter {

  constructor (options, projectName, projectLanguage) {
    super(options, projectName, projectLanguage);

    this.linterName = 'CSSLint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.css',
      report   : 'reports/sonar/csslint.json',
      rulesFile: '.csslintrc'
    };
  }

  launch () {
    let ruleset = {};

    csslint.getRules().forEach(function (rule) {
      ruleset[ rule.id ] = 1;
    });

    let rcContent = this.getRCFile(this.options.rulesFile);
    if (rcContent) {
      for (let rule of Object.keys(rcContent)) {
        if (rcContent[ rule ]) {
          ruleset[ rule ] = rcContent[ rule ];
        } else {
          delete ruleset[ rule ];
        }
      }
    }
    this.options.rules = ruleset;

    glob(this.options.src, (er, files) => {
      this.processFiles(files, this.options);
    });
  }

  processFiles (fileArray, options) {
    this.openReporter(options.report);
    fileArray.forEach((file) => {
      this.processFile(file, options);
    });
    this.closeReporter(options.report);
  }

  processFile (file, options) {
    let input = this.readFile(file),
      result = csslint.verify(input, options.rules),
      severity,
      d = (new Date()).getTime(),
      index = 0;

    let fileNbViolations = this.openFileIssues(file, options.report, /^(\s+)?\/\*.*\*\//gm, /^(\s+)?\n$/gm);
    for (let message of result.messages) {
      switch (message.type) {
        case 'error':
          severity = 'MAJOR';
          fileNbViolations[this.MAJOR]++;
          break;
        case 'warning':
          severity = 'MINOR';
          fileNbViolations[this.MINOR]++;
          break;
        default:
          severity = 'INFO';
          fileNbViolations[this.INFO]++;
          break;
      }

      fs.appendFileSync(options.report,
        `{
            "line": ${(message.line ? message.line : null)},
            "message": "${message.message}",
            "description": "${message.rule.desc}",
            "rulekey": "${message.rule.id}",
            "severity": "${severity}",
            "reporter": "csslint",
            "creationDate": "${d}"
          }` +
        ((index < (result.messages.length) - 1) ? ',' : ''));

      index++;
    }

    this.closeFileIssues(fileNbViolations, options.report);
  }


};
