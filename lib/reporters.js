const ReporterFactory = require('./reporter.factory');

class SonarWebReporters {

  /**
   * Create a new SonarWebReporters
   *
   * @param {string}  projectName   The project name
   * @param {Object}  options       User specific options for all reporters
   */
  constructor (projectName, options) {
    if (projectName === undefined) {
      throw new Error('`projectName` parameter is required');
    }
    if (options === undefined) {
      throw new Error('`options` parameter is required');
    }

    this.projectName = projectName;
    this.options = options;
  }

  /**
   * Launch the Sonar Web Front-End Reporters.
   * It automatically launch reporters registered under `ReporterType`.
   *
   * @param {function=}  done  Called after all reporters has been processed
   */
  launchReporters (done) {
    let keys = Object.keys(this.options).filter((key) => this.options[key]),
      count = 0;

    keys.forEach((key) => {
      this.launch(key, this.projectName, this.options[key], () => {
        if (++count === keys.length) {
          done();
        }
      });
    });
  }

  /**
   * Launch a reporter.
   *
   * @param {ReporterType}  type          Type of the reporter to be launched
   * @param {string}        projectName   The project name
   * @param {Object}        options       Reporter options
   * @param {function}      done          Called after reporter is done
   */
  launch (type, projectName, options, done) {
    ReporterFactory.create(type, options, projectName).launch(() => done());
  }

}

module.exports = SonarWebReporters;
