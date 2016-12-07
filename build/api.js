'use strict';

module.exports = {
  Reporters: require('./reporters/all.reporter'),
  CSSLintReporter: require('./reporters/csslint.reporter'),
  ESLintReporter: require('./reporters/eslint.reporter'),
  ESLintAngularReporter: require('./reporters/eslint-angular.reporter'),
  HTMLHintReporter: require('./reporters/htmlhint.reporter'),
  JSHintReporter: require('./reporters/jshint.reporter'),
  TSLintReporter: require('./reporters/tslint.reporter'),
  SASSLintReporter: require('./reporters/sasslint.reporter')
};