module.exports = {
  defaultOptions: {
    src      : './test/mocks/test.css',
    report   : './test/output/css.json',
    rulesFile: './test/mocks/.csslintrc'
  },
  badFileSrcOptions: {
    src      : './test/mocks/test.ss',
    report   : './test/output/css.json',
    rulesFile: './test/mocks/.csslintrc'
  },
  badRulesFileOptions: {
    src      : './test/mocks/test.css',
    report   : './test/output/css.json',
    rulesFile: './test/mocks/.bad'
  }
};
