/* global __dirname */
const fs = require('fs'),
  mkdirp = require('mkdirp'),
  path = require('path'),
  os = require('os'),
  VERSION = '1.1.0',
  BASE_PROJECT = path.normalize(__dirname.substring(0, __dirname.indexOf('/node_') + 1));

class Reporter {

  /**
   * Instantiante a reporter
   *
   * @param   {Object}                options           User specific options.
   * @param   {string}                projectName       The project name, coming from `.sreporterrc` file and used later by SonarQube.
   */
  constructor (options, projectName) {
    this.options = options;
    this.projectName = projectName;
    this.nbFiles = 0;
    this.totalLines = 0;
    this.totalComments = 0;
    this.totalClocs = 0;
    this.nbViolations = {
      blocker : 0,
      critical: 0,
      major   : 0,
      minor   : 0,
      info    : 0
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
        throw new Error(`Rules file '${options.rulesFile}' does not exist`);
      }
    }

    if (!projectName) {
      throw new Error(`Project name must not be null`);
    }
  }

  /**
   * Specifiy the default options for the Reporter.
   * They will be overrided by the user specific options.
   *
   * @returns {{src: string, report: string, rulesFile: string}}
   */
  static defaultOptions () {
    throw new Error('defaultOptions method must be implemented');
  }

  /**
   * Launch the reporter creation.
   *
   * @param {function=}  done  Called when the launch process is done.
   */
  launch () {
    throw new Error('Launch method must be implemented');
  }

  /**
   * Recursively create the reporter path
   */
  makeReportDirectory (reportPath) {
    let path = reportPath.substring(0, reportPath.lastIndexOf('/'));

    if (!fs.existsSync(path)) {
      mkdirp.sync(path);
    }
  }

  readFile (filename) {
    try {
      return fs.readFileSync(filename, 'utf-8');
    } catch (ex) {
      return '';
    }
  }

  getRCFile (file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  openReporter () {
    this.fileContent.project = this.projectName;
    this.fileContent.projectPath = BASE_PROJECT;
    this.fileContent.version = VERSION;
    this.fileContent.files = [];
  }

  closeReporter (reportFile) {
    this.fileContent.nbFiles = this.nbFiles;
    this.fileContent.nbLines = this.totalLines;
    this.fileContent.nbCloc = this.totalClocs;
    this.fileContent.nbComments = this.totalComments;
    this.fileContent.violations = {
      blocker : this.nbViolations[this.BLOCKER],
      critical: this.nbViolations[this.CRITICAL],
      major   : this.nbViolations[this.MAJOR],
      minor   : this.nbViolations[this.MINOR],
      info    : this.nbViolations[this.INFO]
    };
    fs.writeFileSync(reportFile, JSON.stringify(this.fileContent, null, 4));
  }

  openFileIssues (file, commentsRegexp, spaceRegexp) {
    let linesCount = this.fileLinesCount(file);
    let lastSlash = file.lastIndexOf('/');
    let filePath = file.substring(0, lastSlash);
    let normalizedFilePath = (os.platform() === 'win32' || os.platform() === 'win64') ? filePath.replace(/\\/g, '\\\\') : filePath;
    this.nbFiles++;

    let b = null,
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

    let fileNbComments = c.length,
      fileNbCloc = linesCount - fileNbComments - d.length;
    this.totalLines += linesCount;
    this.totalComments += fileNbComments;
    this.totalClocs += fileNbCloc;

    this.fileContent.files.push({
      name      : file.substring(lastSlash + 1),
      path      : normalizedFilePath,
      nbLines   : linesCount,
      nbComments: fileNbComments,
      nbCloc    : fileNbCloc,
      violations: {
        blocker : 0,
        critical: 0,
        major   : 0,
        minor   : 0,
        info    : 0
      },
      issues    : []
    });
  }

  addIssue (line, message, description, ruleKey, severity, reporter) {
    let fileObject = this.fileContent.files[this.fileContent.files.length - 1];
    fileObject.violations[severity]++;
    this.nbViolations[severity]++;
    fileObject.issues.push({
      line        : line,
      message     : message,
      description : description,
      rulekey     : ruleKey,
      severity    : severity,
      reporter    : reporter,
      creationDate: (new Date()).getTime()
    });
  }

  fileLinesCount (file) {
    return fs.readFileSync(file).toString().split('\n').length - 1;
  }
}

module.exports = Reporter;
