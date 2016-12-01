require('chai').should();

const SASSLintReporter = require('../../reporters/sasslint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  sassLintMock = require('./sasslint.reporter.mock'),
  fs = require('fs');

module.exports = () => {

  describe('SASSLintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new SASSLintReporter(sassLintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'test');
        reporter.launch(() => {
          readJSONFile(sassLintMock.defaultOptions.report).project.should.be.equal('test');
          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'test');
        reporter.launch(() => {
          fs.existsSync(sassLintMock.defaultOptions.report).should.be.equal(true);
          done();
        });
      });

      it('should be the right file number', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.defaultOptions.report);
          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);
          done();
        });
      });

      it('should have 8 issues', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.defaultOptions.report);
          result.files[0].issues.length.should.be.equal(8);
          done();
        });
      });

      it('should have 5 lines', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.defaultOptions.report);
          result.files[0].nbLines.should.be.equal(5);
          done();
        });
      });

      it('should not have processed files', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.badFileSrcOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.badFileSrcOptions.report);
          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);
          done();
        });
      });

      it('should throw bad file exception', () => {
        (() => new SASSLintReporter(sassLintMock.badRulesFileOptions, 'test')).should.throw(Error);
      });


    });

  });

};
