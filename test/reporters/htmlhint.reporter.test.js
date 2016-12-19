require('chai').should();

const fs = require('fs'),
  HTMLHintReporter = require('../../lib/api').HTMLHintReporter,
  HTMLHintReporterES5 = require('../../build/reporters/htmlhint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  htmlHintMock = require('./htmlhint.reporter.mock');

module.exports = () => {

  describe('HTMLHintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new HTMLHintReporter(htmlHintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          readJSONFile(htmlHintMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');

          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          fs.existsSync(htmlHintMock.defaultOptions.report).should.be.equal(true);

          done();
        });
      });

      it('should be the right file number', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it('should have two issues', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'SonarWebFrontEndReporters'),
          expected = ['title-require', 'tag-pair'];

        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(2);
          result.files[0].issues.forEach((val) => {
            val.rulekey.should.be.oneOf(expected);
          });

          done();
        });
      });

      it('should have 7 lines', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.defaultOptions.report);

          result.files[0].nbLines.should.be.equal(7);

          done();
        });
      });

      it ('shouldn\'t match the ignored file', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.multiSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.multiSrcOption.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it('shouldn\'t have processed files', (done) => {
        let reporter = new HTMLHintReporter(htmlHintMock.badFileSrcOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.badFileSrcOptions.report);

          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);

          done();
        });
      });

      it('should throw bad file exception', () => {
        (() => new HTMLHintReporter(htmlHintMock.badRulesFileOptions, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it('should launch with ES5 backward compatibility', (done) => {
        let reporter = new HTMLHintReporterES5(htmlHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(htmlHintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });

      });

    });

  });

};
