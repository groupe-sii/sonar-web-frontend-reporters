const Reporter = require('./reporter'),
  CLIEngine = require('eslint').CLIEngine,
  glob = require('glob'),
  fs = require('fs');

module.exports = class ESLintAngularReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);
    this.linterName = 'ESLint Angular';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.js',
      report   : 'reports/sonar/eslint.json',
      rulesFile: '.eslintrc'
    };
  }

  launch (done) {
    this.options.eslint = this.getRCFile(this.options.rulesFile);
    this.linter = new CLIEngine(this.options.eslint);

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
    let input = this.readFile(file),
      result = this.linter.executeOnText(input, undefined, true),
      severity,
      d = (new Date()).getTime(),
      index = 0;

    let fileNbViolations = this.openFileIssues(file, options.report, null, /^(\s+)?\n$/gm);
    for (let message of result.results[0].messages) {
      switch (message.type) {
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

      let ruleId = message.ruleId.replace('angular/', '');


      fs.appendFileSync(options.report,
        `{
            "line": ${(message.line ? message.line : null)},
            "message": "${message.message}",
            "description": "",
            "rulekey": "ng_${ruleId.replace(/-/g, '_')}",
            "severity": "${severity}",
            "reporter": "eslint",
            "creationDate": "${d}"
          }` +
        ((index < (result.results[0].messages.length) - 1) ? ',' : ''));

      index++;
    }

    this.closeFileIssues(fileNbViolations, options.report);
  }


};
