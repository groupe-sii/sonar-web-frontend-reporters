'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var glob = require('glob-all'),
    CLIEngine = require('eslint').CLIEngine,
    ReporterType = require('../reporter.enum'),
    Reporter = require('../reporter');

module.exports = function (_Reporter) {
  _inherits(ESLintReporter, _Reporter);

  function ESLintReporter(options, projectName) {
    _classCallCheck(this, ESLintReporter);

    var _this = _possibleConstructorReturn(this, (ESLintReporter.__proto__ || Object.getPrototypeOf(ESLintReporter)).call(this, options, projectName));

    _this.linterName = 'ESLint';
    return _this;
  }

  _createClass(ESLintReporter, [{
    key: 'launch',
    value: function launch(done) {
      var _this2 = this;

      this.linter = new CLIEngine({
        configFile: this.options.rulesFile
      });

      glob(this.options.src, function (err, files) {
        _this2.processFiles(files, _this2.options);
        _this2.closeReporter(_this2.options.report);

        if (typeof done === 'function') {
          done();
        }
      });
    }
  }, {
    key: 'processFiles',
    value: function processFiles(fileArray) {
      var _this3 = this;

      this.openReporter();
      fileArray.forEach(function (file) {
        _this3.processFile(file);
      });
    }
  }, {
    key: 'processFile',
    value: function processFile(file) {
      var input = this.readFile(file),
          result = this.linter.executeOnText(input, undefined, true),
          severity = void 0;

      this.openFileIssues(file, null, /^(\s+)?\n$/gm);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = result.results[0].messages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var message = _step.value;

          switch (message.severity) {
            case 2:
              severity = this.MAJOR;
              break;
            case 1:
              severity = this.MINOR;
              break;
            default:
              severity = this.INFO;
              break;
          }
          this.addIssue(message.line ? message.line : null, message.message, '', message.ruleId, severity, ReporterType.ESLINT);
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
        report: 'reports/sonar/eslint.json',
        rulesFile: '.eslintrc'
      };
    }
  }]);

  return ESLintReporter;
}(Reporter);