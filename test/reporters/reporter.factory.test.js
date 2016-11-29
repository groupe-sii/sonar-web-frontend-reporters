const should = require('chai').should(),
  ReporterFactory = require('../../reporters/reporter.factory');

module.exports = () => {

  describe ('ReporterFactory', () => {

    describe ('#mergeOptions', () => {

      it ('should use pre-defined options by default', () => {
        ReporterFactory.mergeOptions(true, {
          option: 'string'
        }).should.be.deep.equal({
          option: 'string'
        });
      });

      it ('should merge pre-defined options with the given ones', () => {
        ReporterFactory.mergeOptions({
          option1: 'string'
        }, {
          option2: 'string'
        }).should.be.deep.equal({
          option1: 'string',
          option2: 'string'
        });
      });

      it ('shouldn\'t return anything if the linter is disabled', () => {
        ReporterFactory.mergeOptions(undefined, {
          option1: 'string'
        }).should.be.deep.equal(false);

        ReporterFactory.mergeOptions(null, {
          option1: 'string'
        }).should.be.deep.equal(false);
      });

    });

  });

};
