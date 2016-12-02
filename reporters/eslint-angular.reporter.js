const glob = require('glob'),
  CLIEngine = require('eslint').CLIEngine,
  ReporterType = require('./reporter.enum'),
  Reporter = require('./reporter');

module.exports = class ESLintAngularReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);

    this.linterName = 'ESLint Angular';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.js',
      report   : 'reports/sonar/eslint-angular.json',
      rulesFile: '.eslintrc'
    };
  }

  launch (done) {
    this.options.eslint = this.getRCFile(this.options.rulesFile);

    // HACK ESLint CLI is expecting an array for the `globals` property, let's transform the object
    // Origin: globals: { "sample": true }
    // Result: globals: [ "sample" ]
    if (typeof this.options.eslint.globals === 'object') {
      this.options.eslint.globals = Object.keys(this.options.eslint.globals);
    }

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
      this.processFile(file);
    });
  }

  processFile (file) {
    let input = this.readFile(file),
      result = this.linter.executeOnText(input, undefined, true),
      severity;

    this.openFileIssues(file, null, /^(\s+)?\n$/gm);
    for (let message of result.results[0].messages) {
      switch (message.type) {
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

      this.addIssue(
        (message.line ? message.line : null),
        message.message,
        '',
        `ng_${message.ruleId.replace('angular/', '').replace(/-/g, '_')}`,
        severity,
        ReporterType.ESLINTANGULAR
      );
    }
  }


};
