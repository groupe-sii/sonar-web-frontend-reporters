'use strict';

var gulp = require('gulp'),
		mkdirp = require('mkdirp'),
		fs = require('fs'),
		run = require('run-sequence');

function createReportPath(reportPath){
	var path = reportPath.substring(0,reportPath.lastIndexOf("/"));
	if (!fs.existsSync(path)){
		mkdirp.sync(path);
	}
}

function SonarWebReporters() {
		this.SCSSReporter = require('./scssReporter.js');
		this.JSReporter = require('./jsReporter.js');
		this.ESReporter = require('./esLintReporter.js');
		this.HTMLReporter = require('./htmlReporter.js');
		this.CSSReporter = require('./cssReporter.js');
		this.TSLINTReporter = require('./tslintReporter.js');

		this.launchReporters = function(options){
			var tasks = [], projectName = options.project || options.projectName || "";
			if (options.css){
				var csslint = require('gulp-csslint'),
					cssSources = options.css.src || options.css.sources || "src/**/*.css",
					cssPath = options.css.report || "reports/sonar/csslint.json",
					cssTask = options.css.task || "ci-csslint",
					cssReporter = new this.CSSReporter(cssPath);
					createReportPath(cssPath);

					gulp.task(cssTask, function() {
							cssReporter.openReporter(projectName, cssPath);
							return gulp.src(cssSources)
									.pipe(csslint())
									.pipe(csslint.reporter(cssReporter.reporter.bind(cssReporter)))
									.on('end', cssReporter.closeReporter.bind(cssReporter));
					});
					tasks.push(cssTask);
			}

			if (options.scss){
				var scsslint = require('gulp-scss-lint'),
					scssSources = options.scss.src || options.scss.sources || "src/**/*.scss",
					scssPath = options.scss.report || "reports/sonar/scsslint.json",
					scssTask = options.scss.task || "ci-scsslint",
					scssReporter = new this.SCSSReporter(scssPath);
					createReportPath(scssPath);

					gulp.task(scssTask, function() {
							scssReporter.openReporter(projectName, scssPath);
							return gulp.src(scssSources)
									.pipe(scsslint({
										customReport: scssReporter.reporter.bind(scssReporter)
									}))
									.on('end', scssReporter.closeReporter.bind(scssReporter));
					});
					tasks.push(scssTask);
			}

			if (options.html){
				var htmlhint = require('gulp-htmlhint'),
					htmlSources = options.html.src || options.html.sources || "src/**/*.html",
					htmlPath = options.html.report || "reports/sonar/htmlhint.json",
					htmlTask = options.html.task || "ci-htmlhint",
					htmlReporter = new this.HTMLReporter(htmlPath);
					createReportPath(htmlPath);

					gulp.task(htmlTask, function() {
							htmlReporter.openReporter(projectName, htmlPath);
							return gulp.src(htmlSources)
									.pipe(htmlhint())
									.pipe(htmlhint.reporter(htmlReporter.reporter.bind(htmlReporter)))
									.on('end', htmlReporter.closeReporter.bind(htmlReporter));
					});
					tasks.push(htmlTask);
			}

			if (options.js){
				var jshint = require('gulp-jshint'),
					jsSources = options.js.src || options.js.sources || "src/**/*.js",
					jsPath = options.js.report || "reports/sonar/jshint.json",
					jsTask = options.js.task || "ci-jshint",
					jsReporter = new this.JSReporter(jsPath);
					createReportPath(jsPath);

					gulp.task(jsTask, function() {
							jsReporter.openReporter(projectName, jsPath);
							return gulp.src(jsSources)
									.pipe(jshint())
									.pipe(jsReporter.reporter)
									.on('end', jsReporter.closeReporter.bind(jsReporter));
					});
					tasks.push(jsTask);
			}

			if (options.eslint){
				var eslint = require('gulp-eslint'),
					eslintSources = options.eslint.src || options.eslint.sources || "src/**/*.js",
					eslintPath = options.eslint.report || "reports/sonar/eslint-angular.json",
					eslintTask = options.eslint.task || "ci-eslint",
					eslintbase = options.eslint.base || "src",
					eslintReporter = new this.ESReporter(eslintPath, eslintbase);
					createReportPath(eslintTask);

					gulp.task(eslintTask, function() {
							eslintReporter.openReporter(projectName, eslintPath);
							return gulp.src(eslintSources)
									.pipe(eslint({
										reset: true
									}))
									.pipe(eslint.format(eslintReporter.reporter));
					});
					tasks.push(eslintTask);
			}

			if (options.ts){
				var tslint = require('gulp-tslint'),
					tsSources = options.ts.src || options.ts.sources || "src/**/*.ts",
					tsPath = options.ts.report || "reports/sonar/tslint.json",
					tsTask = options.ts.task || "ci-tslint",
					tsReporter = new this.TSLINTReporter(tsPath);
					createReportPath(tsPath);

					const testReporter = function (output, file, options) {
					    console.log("Found " + output.length + " errors in " + file.path);
					};

					gulp.task(tsTask, function() {
							tsReporter.openReporter(projectName, tsPath);
							return gulp.src(tsSources)
									.pipe(tslint())

									.pipe(tslint.report(tsReporter.reporter, {
							          emitError: false,
						              sort: true,
						              bell: true,
						              fullPath: true
						          	}))
									//.pipe(tslint.report(tsReporter.reporter.bind(tsReporter)))

									/*.pipe(tslint.report(tsReporter, {
								          emitError: false
									  }))*/
									.on('end', tsReporter.closeReporter.bind(tsReporter));
					});
					tasks.push(tsTask);
			}

			return run(tasks);
		}
}

module.exports = new SonarWebReporters();
