const Reporter = require('./reporter'),
  TSLint = require('tslint'),
  glob = require('glob'),
  fs = require('fs');

module.exports = class TSLintReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);
    this.linterName = 'TSLint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.js',
      report   : 'reports/sonar/tslint.json',
      rulesFile: 'tslint.json'
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
    let input = this.readFile(file),
      tslint = new TSLint.Linter({ formatter: 'prose' }, undefined),
      severity,
      d = (new Date()).getTime(),
      index = 0;

    let configuration = TSLint.Configuration.findConfiguration(this.options.rulesFile || null, file).results;
    tslint.lint(file, input, configuration);

    let fileNbViolations = this.openFileIssues(file, options.report, null, /^(\s+)?\n$/gm);
    let result = tslint.getResult();
    for (let message of result.failures) {
      severity = 'INFO';
      fileNbViolations[this.INFO]++;

      fs.appendFileSync(options.report,
        `{
            "line": ${message.startPosition.lineAndCharacter.line + 1},
            "col": ${message.startPosition.lineAndCharacter.character + 1},
            "message": ${JSON.stringify(message.failure)},
            "description": ${JSON.stringify(message.failure)},
            "rulekey": "${message.ruleName}",
            "severity": "${severity}",
            "reporter": "tslint",
            "creationDate": "${d}"
          }` +
        ((index < (result.failures.length) - 1) ? ',' : ''));

      index++;
    }

    this.closeFileIssues(fileNbViolations, options.report);
  }


};
