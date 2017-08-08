require('chai').should();

const fs = require('fs'),
  ESLintAngularReporter = require('../../lib/api').ESLintAngularReporter,
  ESLintAngularReporterES5 = require('../../build/reporters/eslint-angular.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  esLintAngularMock = require('./eslint-angular.reporter.mock');

module.exports = () => {

  describe ('ESLintAngularReporter', () => {

    describe ('#launch', () => {

      it (`should throw an error if the project name is undefined`, () => {
        (() => new ESLintAngularReporter(esLintAngularMock.defaultOptions)).should.throw(Error);
      });

      it (`should be the right project name`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          readJSONFile(esLintAngularMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');

          done();
        });
      });

      it (`should create the output file`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          fs.existsSync(esLintAngularMock.defaultOptions.report);

          done();
        });
      });

      it (`should be the right number of files`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it (`should have 3 issues`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters'),
          expected = [ 'ng_controller_name', 'ng_no_service_method', 'ng_no_undef' ];

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(3);
          result.files[0].issues.forEach((issue) => {
            issue.rulekey.should.be.oneOf(expected);
          });

          done();
        });
      });

      it (`should be a 14 lines file`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.defaultOptions.report);

          result.files[0].nbLines.should.be.equal(14);

          done();
        });
      });

      it (`should ignore .eslintignore content`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.ignorePathOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.ignorePathOptions.report);

          result.files.length.should.be.equal(1);
          result.files[0].name.should.be.equal('eslint-angular.js');

          done();
        });
      });

      it (`shouldn't match the ignored file`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.multiSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.multiSrcOption.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it (`shouldn't have processed files`, (done) => {
        let reporter = new ESLintAngularReporter(esLintAngularMock.badSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.badSrcOption.report);

          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);

          done();
        });
      });

      it (`should find the rules file`, () => {
        (() => new ESLintAngularReporter(esLintAngularMock.badRulesFileOption, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it (`should launch with ES5 backward compatibility`, (done) => {
        let reporter = new ESLintAngularReporterES5(esLintAngularMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(esLintAngularMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });

      });

    });

  });

};
