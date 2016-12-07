require('chai').should();

const CSSLintReporter = require('../../lib/api').CSSLintReporter,
  CSSLintReporterES5 = require('../../lib/api').ES5.CSSLintReporter,
  readJSONFile = require('../test.utils').readJSONFile,
  cssLintMock = require('./csslint.reporter.mock'),
  fs = require('fs');

module.exports = () => {

  describe('CSSLintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new CSSLintReporter(cssLintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          readJSONFile(cssLintMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');
          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          fs.existsSync(cssLintMock.defaultOptions.report).should.be.equal(true);
          done();
        });
      });

      it('should be the right file number', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(cssLintMock.defaultOptions.report);
          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);
          done();
        });
      });

      it('should have two issues', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(cssLintMock.defaultOptions.report);
          result.files[ 0 ].issues.length.should.be.equal(2);
          let expected = [ 'ids', 'known-properties' ];
          result.files[ 0 ].issues.forEach((val) => {
            val.rulekey.should.be.oneOf(expected);
          });
          done();
        });
      });

      it('should have 4 lines', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(cssLintMock.defaultOptions.report);
          result.files[ 0 ].nbLines.should.be.equal(4);
          done();
        });
      });

      it('should not have processed files', (done) => {
        let reporter = new CSSLintReporter(cssLintMock.badFileSrcOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(cssLintMock.badFileSrcOptions.report);
          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);
          done();
        });
      });

      it('should throw bad file exception', () => {
        (() => new CSSLintReporter(cssLintMock.badRulesFileOptions, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it('should launch with ES5 backward compatibility', (done) => {
        let reporter = new CSSLintReporterES5(cssLintMock.defaultOptions, 'SonarWebFrontEndReporters');
        reporter.launch(() => {
          let result = readJSONFile(cssLintMock.defaultOptions.report);
          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);
          done();
        });
      });

    });

  });

};
