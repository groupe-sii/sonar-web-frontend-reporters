module.exports = {
  defaultOptions: {
    src      : './test/mocks/test.scss',
    report   : './test/output/sass-to-scsslint.json',
    rulesFile: './test/mocks/.sass-lint.yml'
  },
  badFileSrcOptions: {
    src      : './test/mocks/test.ss',
    report   : './test/output/sass-to-scsslint.json',
    rulesFile: './test/mocks/.sass-lint.yml'
  },
  badRulesFileOptions: {
    src      : './test/mocks/test.scss',
    report   : './test/output/sass-to-scsslint.json',
    rulesFile: './test/mocks/.bad'
  }
};
