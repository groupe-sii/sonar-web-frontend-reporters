const glob = require('glob-all'),
  CLIEngine = require('eslint').CLIEngine,
  ReporterType = require('../reporter.enum'),
  Reporter = require('../reporter');

module.exports = class ESLintReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);

    this.linterName = 'ESLint';
  }

  static defaultOptions () {
    return {
      src       : 'src/**/*.js',
      report    : 'reports/sonar/eslint.json',
      rulesFile : '.eslintrc',
      ignorePath: '.eslintignore'
    };
  }

  launch (done) {
    this.linter = new CLIEngine({
      configFile: this.options.rulesFile,
      ignorePath: this.options.ignorePath
    });

    glob(this.options.src, (err, files) => {
      this.processFiles(files, this.options);
      this.closeReporter(this.options.report);

      if (typeof done === 'function') {
        done();
      }
    });
  }

  processFiles (fileArray) {
    this.openReporter();

    const linterResult = this.linter.executeOnFiles(fileArray);

    linterResult.results.forEach((fileResult) => {
      this.processFileResult(fileResult);
    });
  }

  processFileResult (file) {
    let severity;

    this.openFileIssues(file.filePath, null, /^(\s+)?\n$/gm);

    for (const message of file.messages) {
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
      this.addIssue((message.line ? message.line : null), message.message, '', message.ruleId, severity, ReporterType.ESLINT);

    }

  }


};
