#!/usr/bin/env node

const fs = require('fs'),
  mkdirp = require('mkdirp'),
  chalk = require('chalk'),
  ReporterFactory = require('../reporters/reporter.factory');

class CLIEngine {

  constructor () {
    this.options = JSON.parse(fs.readFileSync('./.sreporterrc', 'utf8'));
  }

  /**
   * Launch the Sonar Web Front-End Reporters.
   * It automatically launch reporters registered under `ReporterFactory.TYPE`.
   */
  launchReporters () {
    Object.keys(ReporterFactory.TYPE).forEach((key) => this.launch(ReporterFactory.TYPE[key], this.options));
  }

  /**
   * Launch a reporter.
   *
   * @param {ReporterFactory.TYPE}  type      Type of the reporter to be launched
   * @param {Object}                options   `.sreporterrc` file content
   */
  launch (type, options) {
    let opts = options[type],
      reporter = ReporterFactory.create(type, opts, options.projectName, options.projectLanguage);

    if (opts) {
      this.makeReportDirectory(opts.report);
      reporter.launch();
    } else {
      console.info(chalk.gray(`\u002D ${chalk.gray.bold(reporter.linterName)} has been ignored`));
    }
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

}

let cli = new CLIEngine();
cli.launchReporters();
