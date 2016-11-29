#!/usr/bin/env node

const fs = require('fs'),
  mkdirp = require('mkdirp'),
  CssReporter = require('./reporters/cssReporter');

class SonarWebReporters {

  constructor () {
    this.options = JSON.parse(fs.readFileSync('./.sreporterrc', 'utf8'));
  }

  launchReporters () {
    if (this.options.css) {
      this.launchCss(this.options);
    }
  }

  launchCss(options) {
    let cssOptions = this.mergeOptions(options.css, {
      src: "src/**/*.css",
      report: "reports/sonar/csslint.json",
      rulesFile: ".csslintrc"
    });
    this.makeReportDirectory(cssOptions.report);
    let cssReporter = new CssReporter(options.projectName, options.projectLanguage);
    cssReporter.launch(cssOptions);

  }


  mergeOptions (options, defaultOptions) {
    if (options === true) {
      return defaultOptions;
    } else if (options) {
      return Object.assign(defaultOptions, options);
    }

    return false;
  }

  makeReportDirectory (reportPath) {
    let path = reportPath.substring(0, reportPath.lastIndexOf('/'));

    if (!fs.existsSync(path)) {
      mkdirp.sync(path);
    }
  }

}

let sonarWebReporter = new SonarWebReporters();
sonarWebReporter.launchReporters();

module.exports = SonarWebReporters;
