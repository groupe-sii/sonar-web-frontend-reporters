const glob = require('glob-all'),
  TSLint = require('tslint'),
  ReporterType = require('../reporter.enum'),
  Reporter = require('../reporter');

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
      this.processFiles(files);
      this.closeReporter(this.options.report);

      if (typeof done === 'function') {
        done();
      }
    });
  }

  processFiles (fileArray) {
    this.openReporter();
    fileArray.forEach((file) => {
      this.processFile(file);
    });
  }

  processFile (file) {
    let input = this.readFile(file),
      tslint = new TSLint.Linter({ formatter: 'prose' }, undefined);

    let configuration = TSLint.Configuration.findConfiguration(this.options.rulesFile || null, file).results;
    tslint.lint(file, input, configuration);

    this.openFileIssues(file, null, /^(\s+)?\n$/gm);
    let result = tslint.getResult();
    for (let message of result.failures) {
      this.addIssue(message.startPosition.lineAndCharacter.line + 1, message.failure, message.failure, message.ruleName, this.INFO, ReporterType.TSLINT);
    }
  }


};
