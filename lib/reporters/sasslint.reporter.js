const glob = require('glob-all'),
  sasslint = require('sass-lint'),
  ReporterType = require('../reporter.enum'),
  Reporter = require('../reporter');

module.exports = class SASSLintReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);

    this.linterName = 'SASSLint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.scss',
      report   : 'reports/sonar/scsslint.json',
      rulesFile: '.sass-lint.yml'
    };
  }

  launch (done) {
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
    let result = sasslint.lintFiles(file, {}, options.rulesFile)[0],
      severity;

    this.openFileIssues(file, /^(\s+)?\/\*.*\*\//gm, /^(\s+)?\n$/gm);
    for (let message of result.messages) {
      switch (message.severity) {
        case 2:
          severity = this.MAJOR;
          break;
        case 1:
          severity = this.MINOR;
          break;
        default:
          severity = this.INFO;
          break;
      }

      this.addIssue((message.line ? message.line : null), message.message, message.message, message.ruleId || message.ruleId, severity, ReporterType.SASSLINT);

    }
  }


};
