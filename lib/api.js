module.exports = {
  Reporters             : require('./reporters'),
  CSSLintReporter       : require('./reporters/csslint.reporter'),
  ESLintReporter        : require('./reporters/eslint.reporter'),
  ESLintAngularReporter : require('./reporters/eslint-angular.reporter'),
  HTMLHintReporter      : require('./reporters/htmlhint.reporter'),
  JSHintReporter        : require('./reporters/jshint.reporter'),
  TSLintReporter        : require('./reporters/tslint.reporter'),
  SASSLintReporter      : require('./reporters/sasslint.reporter'),
  SASSToSCSSLintReporter: require('./reporters/sass-to-scsslint.reporter'),
  ES5                   : {
    Reporters             : require('../build/reporters'),
    CSSLintReporter       : require('../build/reporters/csslint.reporter'),
    ESLintReporter        : require('../build/reporters/eslint.reporter'),
    ESLintAngularReporter : require('../build/reporters/eslint-angular.reporter'),
    HTMLHintReporter      : require('../build/reporters/htmlhint.reporter'),
    JSHintReporter        : require('../build/reporters/jshint.reporter'),
    TSLintReporter        : require('../build/reporters/tslint.reporter'),
    SASSLintReporter      : require('../build/reporters/sasslint.reporter'),
    SASSToSCSSLintReporter: require('../build/reporters/sass-to-scsslint.reporter')
  }
};
