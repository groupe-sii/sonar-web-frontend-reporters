var projectName = "Dream-It";
var projectPath = "/home/swat/Dream-It-webapp/src";

// path to source files
var scssSources = ['../src/{app, components}/**/*.scss'];
var jsSources = ['../src/{app, components}/**/*.js'];
var htmlSources = ["../src/{app, components}/**/*.html"];

// path to the report generation folder ending with /
var reportsPath = "report/";

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
        pattern: ['gulp-*']
    });
    
var SCSSReporter = require("./scssReporter.js");
var scssReporter = new SCSSReporter(reportsPath+"scssHint.json");
gulp.task('styles', function() {
  scssReporter.openReporter(projectName, projectPath);
  return gulp.src(scssSources)
    .pipe($.scssLint({
	customReport: scssReporter.reporter.bind(scssReporter)	
    }))
    .on('end', scssReporter.closeReporter.bind(scssReporter));
});

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



var ESReporter = require("./esLintReporter.js");
var esReporter = new ESReporter(reportsPath+"eslint-angular.json");
gulp.task('eslint', function() {
  esReporter.openReporter(projectName, projectPath);
  return gulp.src(jsSources)
    .pipe($.eslint({
		reset: true
	}))
    .pipe($.eslint.format(esReporter.reporter))
    //.on('end', esReporter.closeReporter.bind(esReporter));
    ;
});

var HTMLReporter = require("./htmlReporter.js");
var htmlReporter = new HTMLReporter(reportsPath+"htmlHint.json");
gulp.task('html', function() {
  htmlReporter.openReporter(projectName, projectPath);
  return gulp.src(htmlSources)
    .pipe($.htmlhint()) 
//    .pipe(htmlhint('{"doctype-first" : false}'))
    //.pipe(htmlhint.reporter())
    .pipe($.htmlhint.reporter(htmlReporter.reporter.bind(htmlReporter)))
    .on('end', htmlReporter.closeReporter.bind(htmlReporter));
});

gulp.task('clean', function() {
    return gulp.src(['report/*', 'coverage/*'])
    .pipe($.clean())
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'eslint', 'html');
});
