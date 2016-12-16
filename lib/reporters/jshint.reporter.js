const glob = require('glob-all'),
  jshintcli = require('jshint/src/cli'),
  jshint = require('jshint').JSHINT,
  ReporterType = require('../reporter.enum'),
  Reporter = require('../reporter');

module.exports = class JSHintReporter extends Reporter {

  constructor (options, projectName) {
    super(options, projectName);

    this.linterName = 'JSHint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.js',
      report   : 'reports/sonar/jshint.json',
      rulesFile: '.jshintrc'
    };
  }

  launch (done) {
    this.options.jshint = jshintcli.loadConfig(this.options.rulesFile);
    delete this.options.jshint.dirname;
    this.options.globals = this.options.jshint.globals;
    delete this.options.jshint.globals;

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
      severity;

    jshint(input, options.jshint, options.globals);
    this.openFileIssues(file, null, /^(\s+)?\n$/gm);
    for (let message of jshint.errors) {
      switch (message.id) {
        case '(error)':
          severity = this.MAJOR;
          break;
        case undefined:
          severity = this.BLOCKER;
          break;
        default:
          severity = this.INFO;
          break;
      }

      this.addIssue((message.line ? message.line : null), message.reason, message.raw, message.code, severity, ReporterType.JSHINT);
    }

  }


};
