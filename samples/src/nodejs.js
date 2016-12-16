const SonarWebReporters = require('../../lib/api').Reporters;

let sonarWebReporters = new SonarWebReporters('Sonar Web Reporters', {
  "csslint": false,
  "eslint": {
    "src": "samples/src/**/*.js",
    "report": "reports/sonar/eslint.json",
    "rulesFile": "./samples/.eslintrc"
  },
  "eslintangular": {
    "src": "samples/src/**/*.js",
    "report": "reports/sonar/eslint-angular.json",
    "rulesFile": "./samples/.eslintangularrc"
  },
  "jshint": {
    "src": "samples/src/**/*.js",
    "report": "reports/sonar/jshint.json",
    "rulesFile": "./samples/.jshintrc"
  },
  "htmlhint": {
    "src": "samples/src/**/*.html",
    "report": "reports/sonar/htmlhint.json",
    "rulesFile": "./samples/.htmlhintrc"
  }
});
sonarWebReporters.launchReporters(() => {
  console.log('All reporters have been processed');
});
