module.exports = {

  defaultOptions: {
    src      : 'test/mocks/test.html',
    report   : 'test/output/html.json',
    rulesFile: 'test/mocks/.htmlhintrc'
  },

  multiSrcOption: {
    src      : [ 'test/mocks/test.html', '!test/mocks/test-ignore.html' ],
    report   : 'test/output/html.json',
    rulesFile: 'test/mocks/.htmlhintrc'
  },

  badFileSrcOptions: {
    src      : 'test/mocks/test.ht',
    report   : 'test/output/html.json',
    rulesFile: 'test/mocks/.htmlhintrc'
  },

  badRulesFileOptions: {
    src      : 'test/mocks/test.html',
    report   : 'test/output/html.json',
    rulesFile: 'test/mocks/.bad'
  }

};
