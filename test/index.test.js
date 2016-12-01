const reporterFactory = require('./reporters/reporter.factory.test'),
  cssLintReporter = require('./reporters/csslint.reporter.test'),
  sassLintReporter = require('./reporters/sasslint.reporter.test'),
  esLintReporter = require('./reporters/eslint.reporter.test');

reporterFactory();
cssLintReporter();
sassLintReporter();
esLintReporter();
