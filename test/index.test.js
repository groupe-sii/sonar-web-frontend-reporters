const SonarWebReporters = require('../index'),
  csslint = require('./reporters/csslint.test');

describe ('sonar-web-frontend-reporters', () => {

  describe ('mergeOptions', () => {

    it ('should use pre-defined options by default', () => {
      let sonarWebReporters = new SonarWebReporters();

      sonarWebReporters.mergeOptions(true, {
        option: 'string'
      }).should.be.deep.equal({
        option: 'string'
      });
    });

    it ('should merge pre-defined options with the given ones', () => {
      let sonarWebReporters = new SonarWebReporters();

      sonarWebReporters.mergeOptions({
        option1: 'string'
      }, {
        option2: 'string'
      }).should.be.deep.equal({
        option1: 'string',
        option2: 'string'
      });
    });

    it ('shouldn\'t return anything if the linter is disabled', () => {
      let sonarWebReporters = new SonarWebReporters();

      sonarWebReporters.mergeOptions(undefined, {
        option1: 'string'
      }).should.be.deep.equal(false);
      sonarWebReporters.mergeOptions(null, {
        option1: 'string'
      }).should.be.deep.equal(false);
    });

  });

  csslint();

});