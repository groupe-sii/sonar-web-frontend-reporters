module.exports = {

  defaultOptions: {
    src      : 'test/mocks/testTS.ts',
    report   : 'test/output/tslint.json',
    rulesFile: 'test/mocks/tslint.json'
  },

  multiSrcOption: {
    src      : [ 'test/mocks/testTS.ts', '!test/mocks/testTS-ignore.ts' ],
    report   : 'test/output/tslint.json',
    rulesFile: 'test/mocks/tslint.json'
  },

  badSrcOption: {
    src      : 'test/mocks/unexisting-file.ts',
    report   : 'test/output/tslint.json',
    rulesFile: 'test/mocks/tslint.json'
  },

  badRulesFileOption: {
    src      : 'test/mocks/testTS.ts',
    report   : 'test/output/tslint.json',
    rulesFile: 'test/mocks/bad.tslint.json'
  }

};
