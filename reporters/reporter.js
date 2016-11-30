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
    this.nbViolations = [0, 0, 0, 0, 0];
    this.BLOCKER = 0;
    this.CRITICAL = 1;
    this.MAJOR = 2;
    this.MINOR = 3;
    this.INFO = 4;
    this.linterName = 'unamed linter';

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

  openReporter (reportFile) {
    fs.writeFileSync(reportFile,
      `{
  "project": "${this.projectName}",
  "projectPath": "${BASE_PROJECT}",
  "version": "${VERSION}",
  "files": [
`);
  }

  closeReporter (reportFile) {
    let buf = fs.readFileSync(reportFile);
    if (buf.toString('utf-8', buf.length - 2, buf.length - 1) === ',') {
      buf = buf.slice(0, buf.length - 2);
    }
    fs.writeFileSync(reportFile, buf);
    fs.appendFileSync(reportFile,
      `
  ],
  "nbFiles": ${this.nbFiles},
  "nbLines": ${this.totalLines},
  "nbCloc": ${this.totalClocs},
  "nbComments": ${this.totalComments},
  "violations": {
    "blocker": ${this.nbViolations[this.BLOCKER]},
    "critical": ${this.nbViolations[this.CRITICAL]},
    "major": ${this.nbViolations[this.MAJOR]},
    "minor": ${this.nbViolations[this.MINOR]},
    "info": ${this.nbViolations[this.INFO]}
  }
}
`);
  }

  openFileIssues (file, reportFile, commentsRegexp, spaceRegexp) {
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

    fs.appendFileSync(reportFile,
      `     {
        "name": "${file.substring(lastSlash + 1)}",
        "path": "${normalizedFilePath}",
        "nbLines": ${linesCount},
        "nbComments": ${fileNbComments},
        "nbCloc": ${fileNbCloc},
        "issues": [
          `);

    return [0, 0, 0, 0, 0];
  }

  closeFileIssues (fileNbViolations, reportFile) {
    this.nbViolations = this.nbViolations.map((val, i) => val + fileNbViolations[i]);
    fs.appendFileSync(reportFile,
      `
      ],
      "violations": {
        "blocker": ${fileNbViolations[this.BLOCKER]},
        "critical": ${fileNbViolations[this.CRITICAL]},
        "major": ${fileNbViolations[this.MAJOR]},
        "minor": ${fileNbViolations[this.MINOR]},
        "info": ${fileNbViolations[this.INFO]}
       }
  },
`);
  }

  fileLinesCount (file) {
    return fs.readFileSync(file).toString().split('\n').length - 1;
  }
}

module.exports = Reporter;
