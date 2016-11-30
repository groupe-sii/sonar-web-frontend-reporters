const reporterFactory = require('./reporters/reporter.factory.test'),
  cssLintReporter = require('./reporters/csslint.reporter.test'),
  esLintReporter = require('./reporters/eslint.reporter.test');

reporterFactory();
cssLintReporter();
esLintReporter();
