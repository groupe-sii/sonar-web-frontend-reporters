const CssReporter = require('./cssReporter');

class ReporterFactory {

  static create (type, options, projectName, projectLanguage) {
    let reporter, opts;

    switch (type) {
      case ReporterFactory.TYPE.CSS:
        opts = ReporterFactory.mergeOptions(options, CssReporter.defaultOptions());
        reporter = new CssReporter(opts, projectName, projectLanguage);
        break;

      default:
        throw new Error(`Unknown reporter '${type}'`);
    }

    return reporter;
  }

  static mergeOptions (options, defaultOptions) {
    if (options === true) {
      return defaultOptions;
    } else if (options) {
      return Object.assign(defaultOptions, options);
    }

    return false;
  }

}

ReporterFactory.TYPE = {
  CSS   : 'css',
  ESLINT: 'eslint'
};

module.exports = ReporterFactory;