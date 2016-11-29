const CssReporter = require('./csslint.reporter'),
  ESLintReporter = require('./eslint.reporter'),
  ESLintAngularReporter = require('./eslint-angular.reporter'),
  JSHintReporter = require('./jshint.reporter'),
  HTMLHintReporter = require('./htmlhint.reporter');

/**
 * Handle the reporters creation.
 */
class ReporterFactory {

  /**
   * Instantiante a reporter
   *
   * @param   {ReporterFactory.TYPE}  type              Reporter type
   * @param   {Object}                options           User specific options
   * @param   {string}                projectName       The project name, coming from `.sreporterrc` file and use lately by SonarQube
   * @param   {string}                projectLanguage   The project language, coming from `.sreporterrc` file and use lately by SonarQube
   * @returns {Reporter}                                Instance of `Reporter`
   */
  static create(type, options, projectName, projectLanguage) {
    let reporter, opts;

    switch (type) {
      case ReporterFactory.TYPE.CSS:
        opts = ReporterFactory.mergeOptions(options, CssReporter.defaultOptions());
        reporter = new CssReporter(opts, projectName, projectLanguage);
        break;

      case ReporterFactory.TYPE.ESLINT:
        opts = ReporterFactory.mergeOptions(options, ESLintReporter.defaultOptions());
        reporter = new ESLintReporter(opts, projectName, projectLanguage);
        break;

      case ReporterFactory.TYPE.ESLINTANGULAR:
        opts = ReporterFactory.mergeOptions(options, ESLintAngularReporter.defaultOptions());
        reporter = new ESLintAngularReporter(opts, projectName, projectLanguage);
        break;

      case ReporterFactory.TYPE.HTML:
        opts = ReporterFactory.mergeOptions(options, HTMLHintReporter.defaultOptions());
        reporter = new HTMLHintReporter(opts, projectName, projectLanguage);
        break;

      case ReporterFactory.TYPE.JSHINT:
        opts = ReporterFactory.mergeOptions(options, JSHintReporter.defaultOptions());
        reporter = new JSHintReporter(opts, projectName, projectLanguage);
        break;

      default:
        throw new Error(`Unknown reporter '${type}'`);
    }

    return reporter;
  }

/**
 * Merge the user specific options with the default ones of the repoter.
 * Prioritize the user options.
 *
 * @param   {Object}        options         User specific options
 * @param   {Object}        defaultOptions  Default repoter options
 * @returns {Object|false}                  Merged options; Or FALSE if this reporter should be ignored
 */
  static mergeOptions(options, defaultOptions) {
    if (options === true) {
      return defaultOptions;
    } else if (options) {
      return Object.assign(defaultOptions, options);
    }

    return false;
  }

}

/**
 * @typedef {Object} ReporterFactory.TYPE
 */
ReporterFactory.TYPE = {
  CSS          : 'css',
  ESLINT       : 'eslint',
  ESLINTANGULAR: 'eslintangular',
  HTML         : 'html',
  JSHINT       : 'jshint'
};

module.exports = ReporterFactory;
