require('chai').should();

const fs = require('fs'),
  SASSLintReporter = require('../../lib/api').SASSLintReporter,
  SASSLintReporterES5 = require('../../lib/api').ES5.SASSLintReporter,
  readJSONFile = require('../test.utils').readJSONFile,
  sassLintMock = require('./sasslint.reporter.mock');

module.exports = () => {

  describe('SASSLintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new SASSLintReporter(sassLintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          readJSONFile(sassLintMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');
          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          fs.existsSync(sassLintMock.defaultOptions.report).should.be.equal(true);
          done();
        });
      });

      it('should be the right file number', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.defaultOptions.report);
          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);
          done();
        });
      });

      it('should have 8 issues', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.defaultOptions.report);
          result.files[0].issues.length.should.be.equal(8);
          let expected = ['no-color-literals', 'hex-notation', 'property-sort-order', 'no-misspelled-properties', 'space-before-brace', 'no-ids', 'no-css-comments'];
          result.files[0].issues.forEach((val) => {
            val.rulekey.should.be.oneOf(expected);
          });
          done();
        });
      });

      it('should have 5 lines', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.defaultOptions.report);
          result.files[0].nbLines.should.be.equal(5);
          done();
        });
      });

      it('should not have processed files', (done) => {
        let reporter = new SASSLintReporter(sassLintMock.badFileSrcOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.badFileSrcOptions.report);
          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);
          done();
        });
      });

      it('should throw bad file exception', () => {
        (() => new SASSLintReporter(sassLintMock.badRulesFileOptions, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it('should launch with ES5 backward compatibility', (done) => {
        let reporter = new SASSLintReporterES5(sassLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(sassLintMock.defaultOptions.report);
          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);
          done();
        });
      });

    });

  });

};
