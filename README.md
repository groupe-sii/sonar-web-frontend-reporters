# WARNING: UNMAINTAINED PROJECT

This project is no longer supported or maintained. Please consider reviewing code and dependencies before using it.

# Sonar Web Front-End Reporters

[![Build Status](https://travis-ci.org/groupe-sii/sonar-web-frontend-reporters.svg?branch=master)](https://travis-ci.org/groupe-sii/sonar-web-frontend-reporters)
[![NPM version][npm-image]][npm-url]

[npm-image]: https://badge.fury.io/js/sonar-web-frontend-reporters.svg
[npm-url]: https://npmjs.org/package/sonar-web-frontend-reporters

> `sreporter` is a Command-Line Interface to generate linters reporters for the [SonarQube](https://github.com/groupe-sii/sonar-web-frontend-plugin) plugin.

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
$ sreporter [options]
```

#### Options

The command line utility has several options. You can view the options by running `eslint -h`.

```sh
Usage: sreporter [options]

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -c, --config <path>  Use configuration from this file. Defaults to ./.sreporterrc
  --es5                launch CLI with ES5 backward compatibility
```

The Command-Line Interface uses a configuration file (default is `.sreporterrc`) to define the reporters configuration. The configuration file is mandatory in order to use the CLI.

Default options are as follows:

```json
{
  "projectName": "Sonar Web Front-End Reporter",
  "csslint": {
    "src": "src/**/*.css",
    "report": "reports/sonar/csslint.json",
    "rulesFile": ".csslintrc"
  },
  "sasslint": {
    "src": "src/**/*.scss",
    "report": "reports/sonar/scsslint.json",
    "rulesFile": ".sass-lint.yml"
  },
  "sass-to-scsslint": {
    "src": "src/**/*.scss",
    "report": "reports/sonar/scsslint.json",
    "rulesFile": ".sass-lint.yml"
  },
  "htmlhint": {
    "src": "src/**/*.html",
    "report": "reports/sonar/htmlhint.json",
    "rulesFile": ".htmlhintrc"
  },
  "eslint": {
    "src": "src/**/*.js",
    "report": "reports/sonar/eslint.json",
    "rulesFile": ".eslintrc",
    "ignorePath": ".eslintignore"
  },
  "eslintangular": {
    "src": "src/**/*.js",
    "report": "eslint-angular.json",
    "rulesFile": ".eslintrc",
    "ignorePath": ".eslintignore"
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

#### ES5 backward compatibility

To use the CLI with older NodeJS versions, you can use the `--es5` option:

```sh
$ sreporter --es5
```

### NodeJS

You can launch all reporters:

```js
const SonarWebReporters = require('sonar-web-frontend-reporters').Reporters;

let sonarWebReporters = new SonarWebReporters('Sonar Web Front-End Reporters', {
  "csslint": {
    "src": "src/**/*.css",
    "report": "reports/sonar/csslint.json",
    "rulesFile": ".csslintrc"
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
  }
});

sonarWebReporters.launchReporters(() => {
  console.log('All reporters have been processed');
});
```

Or just one by one, e.g for CSSLint:

```js
const CSSLintReporter = require('sonar-web-frontend-reporters').CSSLintReporter;

let cssLintReporter = new CSSLintReporter({
  src      : 'src/**/*.css',
  report   : 'reports/sonar/csslint.json',
  rulesFile: '.csslintrc'
}, 'Sonar Web Front-End Reporters');

cssLintReporter.launch(() => {
  console.log('CSSLint reporter has been generated under reports/sonar/csslint.json');
});
```

#### ES5 backward compatibility

To use it with older NodeJS versions, you can require the reporters this way:

```js
var SonarWebReporters = require('sonar-web-frontend-reporters/build/reporters');
var CSSLintReporter = require('sonar-web-frontend-reporters/build/reporters/csslint.reporter');
```

## Available reporters

* CSSLint
* SASSLint
* SASSLint to SCSSLint (convert SASSLint rules to SCSSLint rules, because the SonarQube plugin doesn't support SASSLint rules)
* HTMLHint
* ESLint
* ESLint for AngularJS
* JSHint
* TSLint

## Migrating from 2.x to 3.x

2.x and 3.x versions aren't compatible one to another.

The main reasons for this **3.0** version were that:

* We wanted to remove the Gulp abstraction and create a cleaner and more reusable/maintainable code in full ES6 ;
* We needed to use it in a Webpack project and the integration wasn't that easy.

> Warning:
>
> 3.x version is compatible with NodeJS version **>= 6.5.0** with ES6 support and **>= 4.4.5** with ES5 backward compatibility

You can still use the Gulp version by installing `sonar-web-frontend-reporters@2.1.1`.

However, you can also use it with Gulp this way:

```js
let CSSLintReporter = require('sonar-web-frontend-reporters').CSSLintReporter;

gulp.task('csslint:reporter', (done) => {
  let cssLintReporter = new CSSLintReporter({
    src      : 'src/**/*.css',
    report   : 'reports/sonar/csslint.json',
    rulesFile: '.csslintrc'
  }, 'Sonar Web Front-End Reporters');

  cssLintReporter.launch(() => done());
});
```

## [Contributing](CONTRIBUTING.md)

## License

ISC License

Copyright (c) 2016 Groupe SII
