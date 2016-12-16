const glob = require('glob-all'),
  HTMLHint = require('htmlhint').HTMLHint,
  ReporterType = require('../reporter.enum'),
  Reporter = require('../reporter');

module.exports = class HTMLHintReporter extends Reporter {
  constructor (options, projectName) {
    super(options, projectName);

    this.linterName = 'HTMLHint';
  }

  static defaultOptions () {
    return {
      src      : 'src/**/*.html',
      report   : 'reports/sonar/htmlhint.json',
      rulesFile: '.htmlhintrc'
    };
  }

  launch (done) {
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
      result = HTMLHint.verify(input, options.htmlhint),
      severity;

    this.openFileIssues(file, null, /^(\s+)?\n$/gm);
    for (let message of result) {

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

      this.addIssue((message.line ? message.line : null), message.message, message.rule.description, message.rule.id, severity, ReporterType.HTMLHINT);

    }
  }


};
