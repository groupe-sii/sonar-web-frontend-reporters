module.exports = {

  defaultOptions: {
    src      : 'test/mocks/jshint.js',
    report   : 'test/output/jshint.json',
    rulesFile: 'test/mocks/.jshintrc'
  },

  multiSrcOption: {
    src      : [ 'test/mocks/jshint.js', '!test/mocks/jshint-ignore.js' ],
    report   : 'test/output/jshint.json',
    rulesFile: 'test/mocks/.jshintrc'
  },

  badSrcOption: {
    src      : 'test/mocks/unexisting-file.js',
    report   : 'test/output/jshint.json',
    rulesFile: 'test/mocks/.jshintrc'
  },

  badRulesFileOption: {
    src      : 'test/mocks/jshint.js',
    report   : 'test/output/jshint.json',
    rulesFile: 'test/mocks/bad.jshintrc'
  }

};
