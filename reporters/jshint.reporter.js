const Reporter = require('./reporter'),
  jshintcli = require('jshint/src/cli'),
  jshint = require('jshint').JSHINT,
  glob = require('glob'),
  fs = require('fs');

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
    this.openReporter(options.report);
    fileArray.forEach((file) => {
      this.processFile(file, options);
    });
  }

  processFile (file, options) {
    let input = this.readFile(file),
      jshint(input, options.jshint, options.globals),
      severity,
      d = (new Date()).getTime(),
      index = 0;

    let fileNbViolations = this.openFileIssues(file, options.report, null, /^(\s+)?\n$/gm);
    for (let message of jshint.errors) {
      switch (message.id) {
        case '(error)':
          severity = 'MAJOR';
          fileNbViolations[this.MAJOR]++;
          break;
        case undefined:
          severity = 'BLOCKER';
          fileNbViolations[this.BLOCKER]++;
          break;
        default:
          severity = 'INFO';
          fileNbViolations[this.INFO]++;
          break;
      }


      fs.appendFileSync(options.report,
        `{
            "line": ${(message.line ? message.line : null)},
            "message": ${JSON.stringify(message.reason)},
            "description": ${JSON.stringify(message.raw)},
            "rulekey": "${message.code}",
            "severity": "${severity}",
            "reporter": "jshint",
            "creationDate": "${d}"
          }` +
        ((index < (jshint.errors.length) - 1) ? ',' : ''));

      index++;
    }

    this.closeFileIssues(fileNbViolations, options.report);
  }


};
