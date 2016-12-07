'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReporterFactory = require('./reporter.factory');

var SonarWebReporters = function () {

  /**
   * Create a new SonarWebReporters
   *
   * @param {string}  projectName   The project name
   * @param {Object}  options       User specific options for all reporters
   */
  function SonarWebReporters(projectName, options) {
    _classCallCheck(this, SonarWebReporters);

    if (projectName === undefined) {
      throw new Error('`projectName` parameter is required');
    }
    if (options === undefined) {
      throw new Error('`options` parameter is required');
    }

    this.projectName = projectName;
    this.options = options;
  }

  /**
   * Launch the Sonar Web Front-End Reporters.
   * It automatically launch reporters registered under `ReporterType`.
   *
   * @param {function=}  done  Called after all reporters has been processed
   */


  _createClass(SonarWebReporters, [{
    key: 'launchReporters',
    value: function launchReporters(done) {
      var _this = this;

      var keys = Object.keys(this.options).filter(function (key) {
        return _this.options[key];
      }),
          count = 0;

      keys.forEach(function (key) {
        _this.launch(key, _this.projectName, _this.options[key], function () {
          if (++count === keys.length) {
            done();
          }
        });
      });
    }

    /**
     * Launch a reporter.
     *
     * @param {ReporterType}  type          Type of the reporter to be launched
     * @param {string}        projectName   The project name
     * @param {Object}        options       Reporter options
     * @param {function}      done          Called after reporter is done
     */

  }, {
    key: 'launch',
    value: function launch(type, projectName, options, done) {
      ReporterFactory.create(type, options, projectName).launch(function () {
        return done();
      });
    }
  }]);

  return SonarWebReporters;
}();

module.exports = SonarWebReporters;