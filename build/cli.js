'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint no-console:off */

var fs = require('fs'),
    chalk = require('chalk'),
    ReporterType = require('./reporter.enum'),
    ReporterFactory = require('./reporter.factory');

var CLIEngine = function () {

  /**
   * Instantiate a new CLIEngine
   *
   * @param {string=}  [config=./.sreporterrc]  Use configuration from this file. Defaults to ./.sreporterrc.
   */
  function CLIEngine() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './.sreporterrc';

    _classCallCheck(this, CLIEngine);

    if (!fs.existsSync(config)) {
      throw new Error(config + ' file is missing');
    }

    this.options = JSON.parse(fs.readFileSync(config, 'utf8'));
  }

  /**
   * Launch the Sonar Web Front-End Reporters.
   * It automatically launch reporters registered under `ReporterType`.
   */


  _createClass(CLIEngine, [{
    key: 'launchReporters',
    value: function launchReporters() {
      var _this = this;

      Object.keys(ReporterType).forEach(function (key) {
        return _this.launch(ReporterType[key], _this.options);
      });
    }

    /**
     * Launch a reporter.
     *
     * @param {ReporterType}  type      Type of the reporter to be launched
     * @param {Object}        options   `.sreporterrc` file content
     */

  }, {
    key: 'launch',
    value: function launch(type, options) {
      var opts = options[type],
          reporter = ReporterFactory.create(type, opts, options.projectName);

      if (opts) {
        reporter.launch(function () {
          console.info(chalk.green('\u2714 ' + chalk.green.bold(reporter.linterName) + ' has been generated under ' + opts.report));
        });
      } else {
        console.info(chalk.gray('- ' + chalk.gray.bold(reporter.linterName) + ' has been ignored'));
      }
    }
  }]);

  return CLIEngine;
}();

module.exports = CLIEngine;