require('chai').should();

const fs = require('fs'),
  TSLintReporter = require('../../lib/api').TSLintReporter,
  TSLintReporterES5 = require('../../build/reporters/tslint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  tsLintMock = require('./tslint.reporter.mock');

module.exports = () => {

  describe('TSLintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new TSLintReporter(tsLintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new TSLintReporter(tsLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          readJSONFile(tsLintMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');

          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new TSLintReporter(tsLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          fs.existsSync(tsLintMock.defaultOptions.report);

          done();
        });
      });

      it('should be the right number of files', (done) => {
        let reporter = new TSLintReporter(tsLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(tsLintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it ('should have 2 issues', (done) => {
        let reporter = new TSLintReporter(tsLintMock.defaultOptions, 'SonarWebFrontEndReporters'),
          expected = ['no-var-keyword', 'comment-format'];

        reporter.launch(() => {
          let result = readJSONFile(tsLintMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(2);
          result.files[0].issues.forEach((val) => {
            val.rulekey.should.be.oneOf(expected);
          });

          done();
        });
      });

      it ('should be a two lines file', (done) => {
        let reporter = new TSLintReporter(tsLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(tsLintMock.defaultOptions.report);

          result.files[0].nbLines.should.be.equal(2);

          done();
        });
      });

      it ('shouldn\'t match the ignored file', (done) => {
        let reporter = new TSLintReporter(tsLintMock.multiSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(tsLintMock.multiSrcOption.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it ('shouldn\'t have processed files', (done) => {
        let reporter = new TSLintReporter(tsLintMock.badSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(tsLintMock.badSrcOption.report);

          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);

          done();
        });
      });

      it('should find the rules file', () => {
        (() => new TSLintReporter(tsLintMock.badRulesFileOption, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it('should launch with ES5 backward compatibility', (done) => {
        let reporter = new TSLintReporterES5(tsLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(tsLintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });

      });

    });

  });

};
