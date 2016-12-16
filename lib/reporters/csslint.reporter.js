const glob = require('glob-all'),
  csslint = require('csslint').CSSLint,
  ReporterType = require('../reporter.enum'),
  Reporter = require('../reporter');

module.exports = class CSSLintReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);

    this.linterName = 'CSSLint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.css',
      report   : 'reports/sonar/csslint.json',
      rulesFile: '.csslintrc'
    };
  }

  launch (done) {
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
      this.closeReporter(this.options.report);

      if (typeof done === 'function') {
        done();
      }
    });
  }

  processFiles (fileArray, options) {
    this.openReporter();
    fileArray.forEach((file) => {
      this.processFile(file, options);
    });
  }

  processFile (file, options) {
    let input = this.readFile(file),
      result = csslint.verify(input, options.rules),
      severity;

    this.openFileIssues(file, /^(\s+)?\/\*.*\*\//gm, /^(\s+)?\n$/gm);
    for (let message of result.messages) {
      switch (message.type) {
        case 'error':
          severity = this.MAJOR;
          break;
        case 'warning':
          severity = this.MINOR;
          break;
        default:
          severity = this.INFO;
          break;
      }

      this.addIssue((message.line ? message.line : null), message.message, message.rule.desc, message.rule.id, severity, ReporterType.CSSLINT);

    }

  }


};
