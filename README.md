# front-end-continuous-integration
This is a repo of SII continuous integration build system dedicated to Front-end webapps. This repo provides all the reporters written by SII for the generic [Sonarqube plugin](https://github.com/groupe-sii/sonar-web-client-plugin)

# Tutorial

An example project is available here : https://github.com/groupe-sii/sonar-web-frontend-helloworld

# Informations for Sonarqube
The export file for Sonarqube is a JSON file providing all informations a Sonarqube issue might have :
* Project Description
  * language : The programmation(cough) language of the project (HTML, CSS, JS, whatever)
  * project : The name of the project
  * projectPath : The path to the sources of the project for Sonarqube parsing
  * version : The project version
  * violations : Object summarizing the number of violations in the project sorted by severity
  * nbFiles : Number of scanned files in the project
  * nbLines : Total number of lines in scanned files
  * nbComments : Total number of commented lines in scanned files
  * nbCloc : Total number of lines of code (non empty non comment) in scanned files
  * files : Array of scanned files
* File description
  * name : File name
  * path : File path relative to project's path
  * nbLines : Number of lines in the file
  * nbComments : Number of commented lines in the file
  * nbCloc : Number of lines of code (non empty non comment) in the file
  * violations : Object summarizing the number of violations in the file sorted by severity
  * issues : Array of issues in the file
* Issue description
  * line : The line where the issue occurs in the file
  * message : Summary of the issue
  * description : Long test descrtibing the issue
  * rulekey : The unique identifier of the issue
  * severity : Issue severity (one of INFO,MINOR,MAJOR,CRITICAL,BLOCKER)
  * reporter : Name of the reporter used to generate this issue
  * creationDate : Date of issue creation

# Reporters
Reporters are custom reporters written for the gulp tasks of each linter, the output is a Sonarqube compatible JSON file.
A Reporter must be open before being passed to linter/hinter plugin, and closed after the linter/hinter plugin ended its task.

# HTML Reporter
Reporter for [HTMLhint](http://htmlhint.com/)
## Usage
```Javascript
var HTMLReporter = require("./htmlReporter.js");
var htmlReporter = new HTMLReporter(reportsPath+"htmlHint.json");
gulp.task('html', function() {
  htmlReporter.openReporter(projectName, projectPath);
  return gulp.src(htmlSources)
    .pipe($.htmlhint()) 
    .pipe($.htmlhint.reporter(htmlReporter.reporter.bind(htmlReporter)))
    .on('end', htmlReporter.closeReporter.bind(htmlReporter));
});
```


# JS Reporter
Reporter for [JShint](http://jshint.com/)
## Usage
```Javascript
var JSReporter = require("./jsReporter.js");
var jsReporter = new JSReporter(reportsPath+"jsHint.json");
gulp.task('scripts', function() {
  jsReporter.openReporter(projectName, projectPath);
  return gulp.src(jsSources)
    .pipe($.jshint())
    .pipe(jsReporter.reporter)
    .on('end', jsReporter.closeReporter.bind(jsReporter));
    ;
});
```

# CSS Reporter
Reporter for [CSSlint](http://csslint.net/)
## Usage
```Javascript
var CSSReporter = require("./cssReporter.js");
var cssReporter = new CSSReporter(reportsPath+"cssHint.json");
gulp.task('styles', function() {
  cssReporter.openReporter(projectName, projectPath);
  return gulp.src(cssSources)
    .pipe($.csslint())
    .pipe($.csslint.reporter(cssReporter.reporter.bind(cssReporter)))
    .on('end', cssReporter.closeReporter.bind(cssReporter));
});
```

# SCSS Reporter
Reporter for [SCSSLint](https://github.com/brigade/scss-lint)
## Usage
```Javascript
var SCSSReporter = require("./scssReporter.js");
var scssReporter = new SCSSReporter("scsslint.json");
gulp.task('scss-lint', function() {
  scssReporter.openReporter(projectName, projectPath);
  gulp.src(scssSources)
    .pipe(scsslint({
        customReport: scssReporter.reporter.bind(scssReporter)
    }))
    .on('end', scssReporter.closeReporter.bind(scssReporter));
});
```

#esLintReporter
Reporter for [ESLint angular](https://github.com/Gillespie59/eslint-plugin-angular)
## Usage
