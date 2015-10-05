function SonarWebReporters() {
    this.SCSSReporter = require('./scssReporter.js');
    this.JSReporter = require('./jsReporter.js');
    this.ESReporter = require('./esLintReporter.js');
    this.HTMLReporter = require('./htmlReporter.js');
    this.CSSReporter = require('./cssReporter.js');
}

module.exports = new SonarWebReporters();