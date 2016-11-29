const ReporterFactory = require('./reporter.factory');

class SonarWebReporters {

  /**
   * Launch the Sonar Web Front-End Reporters.
   * It automatically launch reporters registered under `ReporterFactory.TYPE`.
   *
   * // TODO Pass an options object (like with .sreporterrc)
   * @param {string}  projectName   The project name
   */
  launchReporters (projectName) {
    Object.keys(ReporterFactory.TYPE).forEach((key) => this.launch(ReporterFactory.TYPE[key], projectName));
  }

  /**
   * Launch a reporter.
   *
   * @param {ReporterFactory.TYPE}  type          Type of the reporter to be launched
   * @param {string}                projectName   The project name
   */
  launch (type, projectName) {
    ReporterFactory.create(type, {}, projectName).launch();
  }

}

module.exports = SonarWebReporters;
