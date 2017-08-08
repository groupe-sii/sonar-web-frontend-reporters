# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [3.3.0](https://github.com/groupe-sii/sonar-web-frontend-reporters/compare/3.2.0...3.3.0) - 2017-08-08

### Added

- **eslint**: allow the use of eslint-import [@NumminorihSF]
- **eslint-angular**: allow the use of eslint-import [@ValentinGot]

### Updated

- **package.json**: upgrade `csslint`, `eslint`, `eslint-plugin-angular`, `jshint`, `tslint` and `typescript` versions

## [3.2.0](https://github.com/groupe-sii/sonar-web-frontend-reporters/compare/3.1.1...3.2.0) - 2017-01-20

### Added

- **cli**: add a '-c, --config <path>' option (Closes [#18](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/18)) [@ValentinGot]

## [3.1.1](https://github.com/groupe-sii/sonar-web-frontend-reporters/compare/3.1.0...3.1.1) - 2017-01-11

### Fixed

- **es5**: for **eslint** & **eslint-angular**, use the `severity` property to retrieve the severity (Closes [#16](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/16)) [@ValentinGot]

## [3.1.0](https://github.com/groupe-sii/sonar-web-frontend-reporters/compare/3.0.0...3.1.0) - 2016-12-19

### Added

- **multi-glob**: The `src` property can now take an array of globs (Closes [#15](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/15)) [@ValentinGot]
- **cli**: Add command line usage and version number [@ValentinGot]

### Fixed

- **es5**: The `.ES5.*` require method couldn't work, documentation has been updated accordingly [@ValentinGot]
- **es5**: `arr.includes()` method isn't available on ES5 (Closes [#14](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/14)) [@ValentinGot]
- **eslint**: use the `severity` property to retrieve the severity (Closes [#16](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/16)) [@ValentinGot]
- **eslint-angular**: use the `severity` property to retrieve the severity (Closes [#16](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/16)) [@ValentinGot]

## [3.0.0](https://github.com/groupe-sii/sonar-web-frontend-reporters/compare/3.0.0-beta2...3.0.0) - 2016-12-09

- Release first stable version

## [3.0.0-beta2](https://github.com/groupe-sii/sonar-web-frontend-reporters/compare/3.0.0-beta...3.0.0-beta2) - 2016-12-07

- Add ES5 backward compatibility (Closes #13)

## 3.0.0-beta - 2016-12-05

### Added

- Full ES6
- Command-Line Interface
- Usable in NodeJS
- Refactored all reporters
- Contribution guide

### Removed

- Gulp abstraction

[@ValentinGot]: https://github.com/ValentinGot
[@liollury]: https://github.com/liollury
[@NumminorihSF]: https://github.com/NumminorihSF
