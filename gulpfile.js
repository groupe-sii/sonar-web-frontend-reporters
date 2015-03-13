var projectName = "Devoxx-Game";
var projectPath = "/var/lib/jenkins/workspace/devoxx-game-front/";

var cssSources = ['../app/styles/*.css'];
var jsSources = ['../app/scripts/**/*.js'];
var htmlSources = ["../app/*.html"];


var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
    
var CSSReporter = require("./cssReporter.js");
var cssReporter = new CSSReporter("cssHint.json");
gulp.task('styles', function() {
  cssReporter.openReporter(projectName, projectPath);
  return gulp.src(cssSources)
    .pipe($.csslint())
    .pipe($.csslint.reporter(cssReporter.reporter.bind(cssReporter)))
    .on('end', cssReporter.closeReporter.bind(cssReporter));
});

var JSReporter = require("./jsReporter.js");
var jsReporter = new JSReporter("jsHint.json");
gulp.task('scripts', function() {
  jsReporter.openReporter(projectName, projectPath);
  return gulp.src(jsSources)
    .pipe($.jshint())
    .pipe(jsReporter.reporter)
    .on('end', jsReporter.closeReporter.bind(jsReporter));
    ;
});

var HTMLReporter = require("./htmlReporter.js");
var htmlReporter = new HTMLReporter("htmlHint.json");
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
  return gulp.src(['csslint.txt'], {read: false})
    .pipe($.clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'html');
});
