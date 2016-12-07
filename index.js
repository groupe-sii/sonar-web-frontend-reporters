module.exports = {
  Reporters            : require('./lib/reporters/all.reporter'),
  CSSLintReporter      : require('./lib/reporters/csslint.reporter'),
  ESLintReporter       : require('./lib/reporters/eslint.reporter'),
  ESLintAngularReporter: require('./lib/reporters/eslint-angular.reporter'),
  HTMLHintReporter     : require('./lib/reporters/htmlhint.reporter'),
  JSHintReporter       : require('./lib/reporters/jshint.reporter'),
  TSLintReporter       : require('./lib/reporters/tslint.reporter'),
  SASSLintReporter     : require('./lib/reporters/sasslint.reporter')
};
