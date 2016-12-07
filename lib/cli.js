/* eslint no-console:off */

const fs = require('fs'),
  chalk = require('chalk'),
  ReporterType = require('../lib/reporter.enum'),
  ReporterFactory = require('../lib/reporter.factory');

class CLIEngine {

  constructor () {
    if (!fs.existsSync('./.sreporterrc')) {
      throw new Error('.sreporterrc file is missing');
    }

    this.options = JSON.parse(fs.readFileSync('./.sreporterrc', 'utf8'));
  }

  /**
   * Launch the Sonar Web Front-End Reporters.
   * It automatically launch reporters registered under `ReporterType`.
   */
  launchReporters () {
    Object.keys(ReporterType).forEach((key) => this.launch(ReporterType[key], this.options));
  }

  /**
   * Launch a reporter.
   *
   * @param {ReporterType}  type      Type of the reporter to be launched
   * @param {Object}        options   `.sreporterrc` file content
   */
  launch (type, options) {
    let opts = options[type],
      reporter = ReporterFactory.create(type, opts, options.projectName);

    if (opts) {
      reporter.launch(() => {
        console.info(chalk.green(`\u2714 ${chalk.green.bold(reporter.linterName)} has been generated under ${opts.report}`));
      });
    } else {
      console.info(chalk.gray(`\u002D ${chalk.gray.bold(reporter.linterName)} has been ignored`));
    }
  }

}

module.exports = CLIEngine;
