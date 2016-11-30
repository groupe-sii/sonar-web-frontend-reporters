const Reporter = require('./reporter'),
  scsslint = require('sass-lint'),
  glob = require('glob'),
  fs = require('fs');

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
    this.openReporter(options.report);
    fileArray.forEach((file) => {
      this.processFile(file, options);
    });
  }

  processFile (file, options) {
    let result = scsslint.lintFiles(file, {}, options.rulesFile)[0],
      severity,
      d = (new Date()).getTime(),
      index = 0;

    let fileNbViolations = this.openFileIssues(file, options.report, /^(\s+)?\/\*.*\*\//gm, /^(\s+)?\n$/gm);
    for (let message of result.messages) {
      switch (message.severity) {
        case 2:
          severity = 'MAJOR';
          fileNbViolations[this.MAJOR]++;
          break;
        case 1:
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
            "description": "${message.message}",
            "rulekey": "${message.ruleId}",
            "severity": "${severity}",
            "reporter": "scsslint",
            "creationDate": "${d}"
          }` +
        ((index < (result.messages.length) - 1) ? ',' : ''));

      index++;
    }

    this.closeFileIssues(fileNbViolations, options.report);
  }


};
