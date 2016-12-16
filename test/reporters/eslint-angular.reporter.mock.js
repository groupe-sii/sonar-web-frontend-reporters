module.exports = {

  defaultOptions: {
    src      : 'test/mocks/eslint-angular.js',
    report   : 'test/output/eslint-angular.json',
    rulesFile: 'test/mocks/.eslintangularrc'
  },

  multiSrcOption: {
    src      : [ 'test/mocks/eslint-angular.js', '!test/mocks/eslint-angular-ignore.js' ],
    report   : 'test/output/eslint-angular.json',
    rulesFile: 'test/mocks/.eslintangularrc'
  },

  badSrcOption: {
    src      : 'test/mocks/unexisting-file.js',
    report   : 'test/output/eslint-angular.json',
    rulesFile: 'test/mocks/.eslintangularrc'
  },

  badRulesFileOption: {
    src      : 'test/mocks/eslint-angular.js',
    report   : 'test/output/eslint-angular.json',
    rulesFile: 'test/mocks/bad.eslintangularrc'
  }

};
