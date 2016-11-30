require('chai').should();

const CSSLintReporter = require('../../reporters/csslint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  cssLintMock = require('./csslint.reporter.mock'),
  fs = require('fs'),
  mkdirp = require('mkdirp');

module.exports = () => {

  describe('CSSLintReporter', () => {

    before(function () {
      let path = cssLintMock.defaultOptions.report.substring(0, cssLintMock.defaultOptions.report.lastIndexOf('/'));
      if (!fs.existsSync(path)) {
        mkdirp.sync(path);
      }
    });

    describe('#launch', () => {

      it('should be the right project name', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'test');
        reporter.launch(_ => {
          readJSONFile(cssLintMock.defaultOptions.report).project.should.be.equal('test');
          done();
        });
      });

      it('must have the output file', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'test');
        reporter.launch(_ => {
          fs.existsSync(cssLintMock.defaultOptions.report);
          done();
        });
      });

      it('should be the right file number', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'test');
        reporter.launch(_ => {
          let result = readJSONFile(cssLintMock.defaultOptions.report);
          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);
          done();
        });
      });

    });

  });

};
