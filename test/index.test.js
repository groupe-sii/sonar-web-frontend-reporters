const reporterFactory = require('./reporters/reporter.factory.test'),
  cssLintReporter = require('./reporters/csslint.reporter.test'),
  sassLintReporter = require('./reporters/sasslint.reporter.test'),
  sassToScssLintReporter = require('./reporters/sass-to-scsslint.reporter.test'),
  htmlHintReporter = require('./reporters/htmlhint.reporter.test'),
  esLintReporter = require('./reporters/eslint.reporter.test'),
  esLintAngularReporter = require('./reporters/eslint-angular.reporter.test'),
  jsHintReporter = require('./reporters/jshint.reporter.test'),
  tsLintReporter = require('./reporters/tslint.reporter.test');

reporterFactory();
cssLintReporter();
sassLintReporter();
sassToScssLintReporter();
htmlHintReporter();
esLintReporter();
esLintAngularReporter();
jsHintReporter();
tsLintReporter();
