## Usage

### Installation

### Command-Line Interface

### NodeJS

## Migrating from 2.x to 3.x

2.x and 3.x versions aren't compatible one to another.

The main reasons for this **3.0** version were that:
* We wanted to remove the Gulp abstraction and create a cleaner and more reusable/maintainable code in full ES6 ;
* We needed to use it in a Webpack project and the integration wasn't that easy.

> Warning:
>
> 3.x version is compatible with NodeJS version >= 6.9.1 because it's coded in full ES6

You can still use the Gulp version by installating `sonar-web-frontend-reporters@2.1.1`.

However, you can still use it with Gulp this way:

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
