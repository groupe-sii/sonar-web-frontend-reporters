const gulp = require('gulp'),
  CSSLintReporter = require('../../index').CSSLintReporter,
  ESLintReporter = require('../../index').ESLintReporter;

gulp.task('csslint:reporter', (done) => {
  var cssLintReporter = new CSSLintReporter({
    src      : '*.css',
    report   : '../../reports/sonar/csslint.json',
    rulesFile: '../.csslintrc'
  }, 'ProjectName');

  cssLintReporter.launch(() => done());
});

gulp.task('eslint:reporter', (done) => {
  var eslintReporter = new ESLintReporter({
    src      : '*.js',
    report   : '../../reports/sonar/eslint.json',
    rulesFile: '../.eslintrc'
  }, 'ProjectName');

  return eslintReporter.launch(() => done());
});

gulp.task('default', [ 'csslint:reporter', 'eslint:reporter' ]);
