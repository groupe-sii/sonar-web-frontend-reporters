require('chai').should();

const fs = require('fs'),
  ESLintReporter = require('../../lib/api').ESLintReporter,
  ESLintReporterES5 = require('../../build/reporters/eslint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  esLintMock = require('./eslint.reporter.mock');

module.exports = () => {

  describe('ESLintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new ESLintReporter(esLintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new ESLintReporter(esLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          readJSONFile(esLintMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');

          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new ESLintReporter(esLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          fs.existsSync(esLintMock.defaultOptions.report);

          done();
        });
      });

      it('should be the right number of files', (done) => {
        let reporter = new ESLintReporter(esLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it ('should have an issue', (done) => {
        let reporter = new ESLintReporter(esLintMock.defaultOptions, 'SonarWebFrontEndReporters'),
          expected = [ 'no-unused-vars' ];

        reporter.launch(() => {
          let result = readJSONFile(esLintMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(1);
          result.files[0].issues.forEach((issue) => {
            issue.rulekey.should.be.oneOf(expected);
          });

          done();
        });
      });

      it ('should be a one line file', (done) => {
        let reporter = new ESLintReporter(esLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintMock.defaultOptions.report);

          result.files[0].nbLines.should.be.equal(1);

          done();
        });
      });

      it ('shouldn\'t match the ignored file', (done) => {
        let reporter = new ESLintReporter(esLintMock.multiSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintMock.multiSrcOption.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it ('shouldn\'t have processed files', (done) => {
        let reporter = new ESLintReporter(esLintMock.badSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintMock.badSrcOption.report);

          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);

          done();
        });
      });

      it('should find the rules file', () => {
        (() => new ESLintReporter(esLintMock.badRulesFileOption, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it('should launch with ES5 backward compatibility', (done) => {
        let reporter = new ESLintReporterES5(esLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });

      });

    });

  });

};
