const Reporter = require('./reporter'),
  HTMLHint = require('htmlhint').HTMLHint,
  glob = require('glob'),
  fs = require('fs');

module.exports = class HTMLHintReporter extends Reporter {
  constructor (options, projectName, projectLanguage) {
    super(options, projectName, projectLanguage);
    this.linterName = 'HTMLHint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.html',
      report   : 'reports/sonar/htmlhint.json',
      rulesFile: '.htmlhintrc'
    };
  }

  launch () {
    let optionsRC = this.getRCFile(this.options.rulesFile);
    this.options.htmlhint = [];
    for (var key in HTMLHint.defaultRuleset) {
      if (HTMLHint.defaultRuleset.hasOwnProperty(key)) {
        this.options.htmlhint[key] = 1;
      }
    }

    for (var rule in optionsRC) {
      if (optionsRC[rule]) {
        this.options.htmlhint[rule] = optionsRC[rule];
      } else {
        delete this.options.htmlhint[rule];
      }
    }

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
      result = HTMLHint.verify(input, options.htmlhint),
      severity,
      d = (new Date()).getTime(),
      index = 0;



    let fileNbViolations = this.openFileIssues(file, options.report, null, /^(\s+)?\n$/gm);
    for (let message of result) {

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
            "message": ${JSON.stringify(message.message)},
            "description": ${JSON.stringify(message.rule.description)},
            "rulekey": "${message.rule.id}",
            "severity": "${severity}",
            "reporter": "htmlhint",
            "creationDate": "${d}"
          }` +
        ((index < (result.length) - 1) ? ',' : ''));

      index++;
    }

    this.closeFileIssues(fileNbViolations, options.report);
  }


};
