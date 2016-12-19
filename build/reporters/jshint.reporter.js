'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var glob = require('glob-all'),
    jshintcli = require('jshint/src/cli'),
    jshint = require('jshint').JSHINT,
    ReporterType = require('../reporter.enum'),
    Reporter = require('../reporter');

module.exports = function (_Reporter) {
  _inherits(JSHintReporter, _Reporter);

  function JSHintReporter(options, projectName) {
    _classCallCheck(this, JSHintReporter);

    var _this = _possibleConstructorReturn(this, (JSHintReporter.__proto__ || Object.getPrototypeOf(JSHintReporter)).call(this, options, projectName));

    _this.linterName = 'JSHint';
    return _this;
  }

  _createClass(JSHintReporter, [{
    key: 'launch',
    value: function launch(done) {
      var _this2 = this;

      this.options.jshint = jshintcli.loadConfig(this.options.rulesFile);
      delete this.options.jshint.dirname;
      this.options.globals = this.options.jshint.globals;
      delete this.options.jshint.globals;

      glob(this.options.src, function (er, files) {
        _this2.processFiles(files, _this2.options);
        _this2.closeReporter(_this2.options.report);

        if (typeof done === 'function') {
          done();
        }
      });
    }
  }, {
    key: 'processFiles',
    value: function processFiles(fileArray, options) {
      var _this3 = this;

      this.openReporter();
      fileArray.forEach(function (file) {
        _this3.processFile(file, options);
      });
    }
  }, {
    key: 'processFile',
    value: function processFile(file, options) {
      var input = this.readFile(file),
          severity = void 0;

      jshint(input, options.jshint, options.globals);
      this.openFileIssues(file, null, /^(\s+)?\n$/gm);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = jshint.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var message = _step.value;

          switch (message.id) {
            case '(error)':
              severity = this.MAJOR;
              break;
            case undefined:
              severity = this.BLOCKER;
              break;
            default:
              severity = this.INFO;
              break;
          }

          this.addIssue(message.line ? message.line : null, message.reason, message.raw, message.code, severity, ReporterType.JSHINT);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }], [{
    key: 'defaultOptions',
    value: function defaultOptions() {
      return {
        src: 'src/**/*.js',
        report: 'reports/sonar/jshint.json',
        rulesFile: '.jshintrc'
      };
    }
  }]);

  return JSHintReporter;
}(Reporter);