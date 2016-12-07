'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global __dirname */
var fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    os = require('os'),
    VERSION = '1.1.0',
    BASE_PROJECT = path.normalize(__dirname.substring(0, __dirname.indexOf('/node_') + 1));

var Reporter = function () {

  /**
   * Instantiante a reporter
   *
   * @param   {Object}                options           User specific options.
   * @param   {string}                projectName       The project name, coming from `.sreporterrc` file and used later by SonarQube.
   */
  function Reporter(options, projectName) {
    _classCallCheck(this, Reporter);

    this.options = options;
    this.projectName = projectName;
    this.nbFiles = 0;
    this.totalLines = 0;
    this.totalComments = 0;
    this.totalClocs = 0;
    this.nbViolations = {
      blocker: 0,
      critical: 0,
      major: 0,
      minor: 0,
      info: 0
    };
    this.BLOCKER = 'blocker';
    this.CRITICAL = 'critical';
    this.MAJOR = 'major';
    this.MINOR = 'minor';
    this.INFO = 'info';
    this.linterName = 'unamed linter';
    this.fileContent = {};

    if (options) {
      this.makeReportDirectory(options.report);
      if (!fs.existsSync(options.rulesFile)) {
        throw new Error('Rules file \'' + options.rulesFile + '\' does not exist');
      }
    }

    if (!projectName) {
      throw new Error('Project name must not be null');
    }
  }

  /**
   * Specify the default options for the Reporter.
   * They will be overriden by the user specific options.
   *
   * @returns {{src: string, report: string, rulesFile: string}}
   */


  _createClass(Reporter, [{
    key: 'launch',


    /**
     * Launch the reporter creation.
     *
     * @param {function=}  done  Called when the launch process is done.
     */
    value: function launch() {
      throw new Error('Launch method must be implemented');
    }

    /**
     * Recursively create the reporter path
     */

  }, {
    key: 'makeReportDirectory',
    value: function makeReportDirectory(reportPath) {
      var path = reportPath.substring(0, reportPath.lastIndexOf('/'));

      if (!fs.existsSync(path)) {
        mkdirp.sync(path);
      }
    }
  }, {
    key: 'readFile',
    value: function readFile(filename) {
      try {
        return fs.readFileSync(filename, 'utf-8');
      } catch (ex) {
        return '';
      }
    }
  }, {
    key: 'getRCFile',
    value: function getRCFile(file) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  }, {
    key: 'openReporter',
    value: function openReporter() {
      this.fileContent.project = this.projectName;
      this.fileContent.projectPath = BASE_PROJECT;
      this.fileContent.version = VERSION;
      this.fileContent.files = [];
    }
  }, {
    key: 'closeReporter',
    value: function closeReporter(reportFile) {
      this.fileContent.nbFiles = this.nbFiles;
      this.fileContent.nbLines = this.totalLines;
      this.fileContent.nbCloc = this.totalClocs;
      this.fileContent.nbComments = this.totalComments;
      this.fileContent.violations = {
        blocker: this.nbViolations[this.BLOCKER],
        critical: this.nbViolations[this.CRITICAL],
        major: this.nbViolations[this.MAJOR],
        minor: this.nbViolations[this.MINOR],
        info: this.nbViolations[this.INFO]
      };
      fs.writeFileSync(reportFile, JSON.stringify(this.fileContent, null, 2));
    }
  }, {
    key: 'openFileIssues',
    value: function openFileIssues(file, commentsRegexp, spaceRegexp) {
      var linesCount = this.fileLinesCount(file);
      var lastSlash = file.lastIndexOf('/');
      var normalizedFilePath = os.platform() === 'win32' || os.platform() === 'win64' ? file.replace(/\\/g, '\\\\') : file;
      this.nbFiles++;

      var b = null,
          c = [],
          d = [],
          str = fs.readFileSync(file).toString();
      if (commentsRegexp) {
        while ((b = commentsRegexp.exec(str)) !== null) {
          c.push(b[0]);
        }
      }
      if (spaceRegexp) {
        while ((b = spaceRegexp.exec(str)) !== null) {
          d.push(b[0]);
        }
      }

      var fileNbComments = c.length,
          fileNbCloc = linesCount - fileNbComments - d.length;
      this.totalLines += linesCount;
      this.totalComments += fileNbComments;
      this.totalClocs += fileNbCloc;

      this.fileContent.files.push({
        name: file.substring(lastSlash + 1),
        path: normalizedFilePath,
        nbLines: linesCount,
        nbComments: fileNbComments,
        nbCloc: fileNbCloc,
        violations: {
          blocker: 0,
          critical: 0,
          major: 0,
          minor: 0,
          info: 0
        },
        issues: []
      });
    }
  }, {
    key: 'addIssue',
    value: function addIssue(line, message, description, ruleKey, severity, reporter) {
      var fileObject = this.fileContent.files[this.fileContent.files.length - 1];
      fileObject.violations[severity]++;
      this.nbViolations[severity]++;
      fileObject.issues.push({
        line: line,
        message: message,
        description: description,
        rulekey: ruleKey,
        severity: severity,
        reporter: reporter,
        creationDate: new Date().getTime()
      });
    }
  }, {
    key: 'fileLinesCount',
    value: function fileLinesCount(file) {
      return fs.readFileSync(file).toString().split('\n').length - 1;
    }
  }], [{
    key: 'defaultOptions',
    value: function defaultOptions() {
      throw new Error('defaultOptions method must be implemented');
    }
  }]);

  return Reporter;
}();

module.exports = Reporter;