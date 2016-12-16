'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var glob = require('glob-all'),
    csslint = require('csslint').CSSLint,
    ReporterType = require('../reporter.enum'),
    Reporter = require('../reporter');

module.exports = function (_Reporter) {
  _inherits(CSSLintReporter, _Reporter);

  function CSSLintReporter(options, projectName) {
    _classCallCheck(this, CSSLintReporter);

    var _this = _possibleConstructorReturn(this, (CSSLintReporter.__proto__ || Object.getPrototypeOf(CSSLintReporter)).call(this, options, projectName));

    _this.linterName = 'CSSLint';
    return _this;
  }

  _createClass(CSSLintReporter, [{
    key: 'launch',
    value: function launch(done) {
      var _this2 = this;

      var ruleset = {};

      csslint.getRules().forEach(function (rule) {
        ruleset[rule.id] = 1;
      });

      var rcContent = this.getRCFile(this.options.rulesFile);
      if (rcContent) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(rcContent)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var rule = _step.value;

            if (rcContent[rule]) {
              ruleset[rule] = rcContent[rule];
            } else {
              delete ruleset[rule];
            }
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
      this.options.rules = ruleset;

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
          result = csslint.verify(input, options.rules),
          severity = void 0;

      this.openFileIssues(file, /^(\s+)?\/\*.*\*\//gm, /^(\s+)?\n$/gm);
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = result.messages[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var message = _step2.value;

          switch (message.type) {
            case 'error':
              severity = this.MAJOR;
              break;
            case 'warning':
              severity = this.MINOR;
              break;
            default:
              severity = this.INFO;
              break;
          }

          this.addIssue(message.line ? message.line : null, message.message, message.rule.desc, message.rule.id, severity, ReporterType.CSSLINT);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }], [{
    key: 'defaultOptions',
    value: function defaultOptions() {
      return {
        src: 'src/**/*.css',
        report: 'reports/sonar/csslint.json',
        rulesFile: '.csslintrc'
      };
    }
  }]);

  return CSSLintReporter;
}(Reporter);