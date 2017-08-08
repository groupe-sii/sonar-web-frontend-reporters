module.exports = {

  defaultOptions: {
    src       : 'test/mocks/eslint.js',
    report    : 'test/output/eslint.json',
    rulesFile : 'test/mocks/.eslintrc',
    ignorePath: 'test/mocks/.eslintignore-custom'
  },

  ignorePathOptions: {
    src       : 'test/mocks/eslint.js',
    report    : 'test/output/eslint.json',
    rulesFile : 'test/mocks/.eslintrc',
    ignorePath: 'test/mocks/.eslintignore-custom'
  },

  multiSrcOption: {
    src      : [ 'test/mocks/eslint.js', '!test/mocks/eslint-ignore.js' ],
    report   : 'test/output/eslint.json',
    rulesFile: 'test/mocks/.eslintrc'
  },

  badSrcOption: {
    src      : 'test/mocks/unexisting-file.js',
    report   : 'test/output/eslint.json',
    rulesFile: 'test/mocks/.eslintrc'
  },

  badRulesFileOption: {
    src      : 'test/mocks/eslint.js',
    report   : 'test/output/eslint.json',
    rulesFile: 'test/mocks/bad.eslintrc'
  }

};
