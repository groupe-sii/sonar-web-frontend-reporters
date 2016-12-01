require('chai').should();

const HTMLHintReporter = require('../../reporters/htmlhint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  htmlHintMock = require('./htmlhint.reporter.mock'),
  fs = require('fs');

module.exports = () => {

  describe('HTMLHintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new HTMLHintReporter(htmlHintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'test');
        reporter.launch(() => {
          readJSONFile(htmlHintMock.defaultOptions.report).project.should.be.equal('test');
          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'test');
        reporter.launch(() => {
          fs.existsSync(htmlHintMock.defaultOptions.report).should.be.equal(true);
          done();
        });
      });

      it('should be the right file number', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.defaultOptions.report);
          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);
          done();
        });
      });

      it('should have two issues', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.defaultOptions.report);
          result.files[0].issues.length.should.be.equal(2);
          done();
        });
      });

      it('should have 7 lines', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.defaultOptions.report);
          result.files[0].nbLines.should.be.equal(7);
          done();
        });
      });

      it('should not have processed files', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.badFileSrcOptions, 'test');
        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.badFileSrcOptions.report);
          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);
          done();
        });
      });

      it('should throw bad file exception', () => {
        (() => new HTMLHintReporter(htmlHintMock.badRulesFileOptions, 'test')).should.throw(Error);
      });


    });

  });

};
