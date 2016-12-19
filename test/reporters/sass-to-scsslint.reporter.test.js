require('chai').should();

const fs = require('fs'),
  SASSToSCSSLintReporter = require('../../lib/api').SASSToSCSSLintReporter,
  SASSToSCSSLintReporterES5 = require('../../build/reporters/sass-to-scsslint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  sasstoScssLintMock = require('./sass-to-scsslint.reporter.mock');

module.exports = () => {

  describe('SASStoSCSSLintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new SASSToSCSSLintReporter(sasstoScssLintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          readJSONFile(sasstoScssLintMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');

          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          fs.existsSync(sasstoScssLintMock.defaultOptions.report).should.be.equal(true);

          done();
        });
      });

      it('should be the right file number', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(sasstoScssLintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it('should have 8 issues', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(sasstoScssLintMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(8);

          done();
        });
      });

      it('should transform SASSLint issues to SCSSLint issues', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.defaultOptions, 'SonarWebFrontEndReporters'),
          expected = ['Comment', 'IdSelector', 'SpaceBeforeBrace', 'PropertySpelling', 'PropertySortOrder', 'HexNotation', 'ColorVariable'];

        reporter.launch(() => {
          let result = readJSONFile(sasstoScssLintMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(8);
          result.files[0].issues.forEach((val) => {
            val.rulekey.should.be.oneOf(expected);
          });

          done();
        });
      });

      it('should have 5 lines', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(sasstoScssLintMock.defaultOptions.report);

          result.files[0].nbLines.should.be.equal(5);

          done();
        });
      });

      it ('shouldn\'t match the ignored file', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.multiSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(sasstoScssLintMock.multiSrcOption.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it('should not have processed files', (done) => {
        let reporter = new SASSToSCSSLintReporter(sasstoScssLintMock.badFileSrcOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(sasstoScssLintMock.badFileSrcOptions.report);

          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);

          done();
        });
      });

      it('should throw bad file exception', () => {
        (() => new SASSToSCSSLintReporter(sasstoScssLintMock.badRulesFileOptions, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it('should launch with ES5 backward compatibility', (done) => {
        let reporter = new SASSToSCSSLintReporterES5(sasstoScssLintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(sasstoScssLintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });

      });

    });

  });

};
