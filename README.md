# Sonar Web Front-End Reporters

[![Build Status](https://travis-ci.org/groupe-sii/sonar-web-frontend-reporters.svg?branch=develop)](https://travis-ci.org/groupe-sii/sonar-web-frontend-reporters)
[![NPM version][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/sonar-web-frontend-reporters.svg
[npm-url]: https://npmjs.org/package/sonar-web-frontend-reporters

## Usage

There is two way of using `sonar-web-frontend-reporters`:

* The Command-Line Interface way
* The NodeJS way

### Installation

```sh
$ npm install sonar-web-frontend-reporters -g           // For CLI use
$ npm install sonar-web-frontend-reporters --save-dev   // For NodeJS use
```

### Command-Line Interface

Launch the CLI by calling:

```sh
$ sreporter
```

The Command-Line Interface uses a `.sreporterrc` file to define the reporters configuration. The `.sreporterrc` file is mandatory in order to use the CLI.

Default options are as follows:

```json
{
  "projectName": "Sonar Web Front-End Reporter",
  "csslint": {
    "src": "src/**/*.css",
    "report": "reports/sonar/csslint.json",
    "rulesFile": ".csslintrc"
  },
  "scsslint": {
    "src": "src/**/*.scss",
    "report": "reports/sonar/scsslint.json",
    "rulesFile": ".scsslintrc"
  },
  "htmlhint": {
    "src": "src/**/*.html",
    "report": "reports/sonar/htmlhint.json",
    "rulesFile": ".htmlhintrc"
  },
  "eslint": {
    "src": "src/**/*.js",
    "report": "reports/sonar/eslint.json",
    "rulesFile": ".eslintrc"
  },
  "eslintangular": {
    "src": "src/**/*.js",
    "report": "eslintangular.json",
    "rulesFile": ".eslintrc"
  },
  "jshint": {
    "src": "src/**/*.js",
    "report": "reports/sonar/jshint.json",
    "rulesFile": ".jshintrc"
  },
  "tslint": {
    "src": "src/**/*.ts",
    "report": "reports/sonar/tslint.json",
    "rulesFile": ".tslintrc"
  }
}
```

#### Disabling a reporter

Disabling a reporter is as simple as removing it from the `.sreporterrc` file.

You can also set it's property to `false`:

```json
{
  "projectName": "Sonar Web Front-End Reporter",
  "csslint": false
}
```

### NodeJS

## Migrating from 2.x to 3.x

2.x and 3.x versions aren't compatible one to another.

The main reasons for this **3.0** version were that:

* We wanted to remove the Gulp abstraction and create a cleaner and more reusable/maintainable code in full ES6 ;
* We needed to use it in a Webpack project and the integration wasn't that easy.

> Warning:
>
> 3.x version is compatible with NodeJS version **>= 6.9.1**

You can still use the Gulp version by installing `sonar-web-frontend-reporters@2.1.1`.

However, you can also use it with Gulp this way:

```js
var CSSLintReporter = require('sonar-web-frontend-reporters').CSSLintReporter;

gulp.task('csslint:reporter', (done) => {
  var cssLintReporter = new CSSLintReporter({
    src      : 'src/**/*.css',
    report   : 'reports/sonar/csslint.json',
    rulesFile: '.csslintrc'
  }, 'ProjectName');

  cssLintReporter.launch(() => done());
});
```
