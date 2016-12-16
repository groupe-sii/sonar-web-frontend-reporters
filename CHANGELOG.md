# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Added

- **multi-glob**: The `src` property can now take an array of globs

### Fixed

- **es5**: The `.ES5.*` require method couldn't work, documentation has been updated accordingly (Closes [#14](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/14)) [@ValentinGot]
- **es5**: `arr.includes()` method isn't available on ES5 (Closes [#14](https://github.com/groupe-sii/sonar-web-frontend-reporters/issues/14)) [@ValentinGot]

## 3.0.0 - 09-12-2016

- Release first stable version

## 3.0.0-beta2 - 07-12-2016

- Add ES5 backward compatibility (Closes #13)

## 3.0.0-beta - 05-12-2016

### Added

- Full ES6
- Command-Line Interface
- Usable in NodeJS
- Refactored all reporters
- Contribution guide

### Removed

- Gulp abstraction

[@ole]: https://github.com/liollury
[@ValentinGot]: https://github.com/ValentinGot
