'use strict';

var gulp = require('gulp'),
		mkdirp = require('mkdirp'),
		fs = require('fs-extra'),
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
		this.ESAngularReporter = require('./esLintAngularReporter.js');
		this.HTMLReporter = require('./htmlReporter.js');
		this.CSSReporter = require('./cssReporter.js');
		this.TSLINTReporter = require('./tslintReporter.js');

		this.launchReporters = function(options){
			var tasks = [], projectName = options.project || options.projectName || "";
			if (options.css){
				var csslint = options.css.linter || require('gulp-csslint'),
					cssSources = options.css.src || options.css.sources || "src/**/*.css",
					cssPath = options.css.report || "reports/sonar/csslint.json",
					cssTask = options.css.task || "ci-csslint",
					cssReporter = new this.CSSReporter(cssPath);
					createReportPath(cssPath);

					gulp.task(cssTask, function() {
							cssReporter.openReporter(projectName, cssPath);
							return gulp.src(cssSources)
									.pipe(csslint(options.css.rulesFile))
									.pipe(csslint.reporter(cssReporter.reporter.bind(cssReporter)))
									.on('end', cssReporter.closeReporter.bind(cssReporter));
					});
					tasks.push(cssTask);
			}

			if (options.scss){
				var scsslint = options.scss.linter || require('gulp-scss-lint'),
					scssSources = options.scss.src || options.scss.sources || "src/**/*.scss",
					scssPath = options.scss.report || "reports/sonar/scsslint.json",
					scssTask = options.scss.task || "ci-scsslint",
					scssReporter = new this.SCSSReporter(scssPath);
					createReportPath(scssPath);

					gulp.task(scssTask, function() {
							scssReporter.openReporter(projectName, scssPath);
							return gulp.src(scssSources)
									.pipe(scsslint({
										customReport: scssReporter.reporter.bind(scssReporter),
										config: options.scss.rulesFile || null
									}))
									.on('end', scssReporter.closeReporter.bind(scssReporter));
					});
					tasks.push(scssTask);
			}

			if (options.html){
				var htmlhint = options.html.linter || require('gulp-htmlhint'),
					htmlSources = options.html.src || options.html.sources || "src/**/*.html",
					htmlPath = options.html.report || "reports/sonar/htmlhint.json",
					htmlTask = options.html.task || "ci-htmlhint",
					htmlReporter = new this.HTMLReporter(htmlPath);
					createReportPath(htmlPath);

					gulp.task(htmlTask, function() {
							htmlReporter.openReporter(projectName, htmlPath);
							return gulp.src(htmlSources)
									.pipe(htmlhint({
										htmlhintrc: options.html.rulesFile || null
									}))
									.pipe(htmlhint.reporter(htmlReporter.reporter.bind(htmlReporter)))
									.on('end', htmlReporter.closeReporter.bind(htmlReporter));
					});
					tasks.push(htmlTask);
			}

			if (options.js){
				var jshint = options.js.linter || require('gulp-jshint'),
					jsSources = options.js.src || options.js.sources || "src/**/*.js",
					jsPath = options.js.report || "reports/sonar/jshint.json",
					jsTask = options.js.task || "ci-jshint",
					jsReporter = new this.JSReporter(jsPath),
					jshintConfig = {};
					createReportPath(jsPath);

					if(options.js.rulesFile) {
						jshintConfig = fs.readJsonSync(process.cwd() + '/' + options.js.rulesFile);
						jshintConfig.lookup = false;
					}

					gulp.task(jsTask, function() {
							jsReporter.openReporter(projectName, jsPath);
							return gulp.src(jsSources)
									.pipe(jshint(jshintConfig))
									.pipe(jsReporter.reporter)
									.on('end', jsReporter.closeReporter.bind(jsReporter));
					});
					tasks.push(jsTask);
			}

			if (options.eslint_angular) {
            var eslintAngular = options.eslint_angular.linter || require('gulp-eslint'),
                eslintAngularSources = options.eslint_angular.src || options.eslint_angular.sources || "src/**/*.js",
                eslintAngularPath = options.eslint_angular.report || "reports/sonar/eslint-angular.json",
                eslintAngularTask = options.eslint_angular.task || "ci-eslint-angular",
                eslintAngularBase = options.eslint_angular.base || "src",
                eslintAngularReporter = new this.ESAngularReporter(eslintAngularPath, eslintAngularBase);
            createReportPath(eslintAngularPath);

            gulp.task(eslintAngularTask, function () {
                eslintAngularReporter.openReporter(projectName, eslintAngularPath);
                return gulp.src(eslintAngularSources)
                    .pipe(eslint({
                        reset: true,
                        configFile: options.eslint_angular.rulesFile
                    }))
                    .pipe(eslintAngular.format(eslintAngularReporter.reporter));
            });
            tasks.push(eslintAngularTask);
        }

			if (options.eslint){
				var eslint = options.eslint.linter || require('gulp-eslint'),
					eslintSources = options.eslint.src || options.eslint.sources || "src/**/*.js",
					eslintPath = options.eslint.report || "reports/sonar/eslint-angular.json",
					eslintTask = options.eslint.task || "ci-eslint",
					eslintBase = options.eslint.base || "src",
					eslintReporter = new this.ESReporter(eslintPath, eslintBase);
					createReportPath(eslintPath);

					gulp.task(eslintTask, function() {
							eslintReporter.openReporter(projectName, eslintPath);
							return gulp.src(eslintSources)
									.pipe(eslint({
										reset: true,
										configFile: options.eslint.rulesFile
									}))
									.pipe(eslint.format(eslintReporter.reporter));
					});
					tasks.push(eslintTask);
			}

			if (options.ts){
				var tslint = options.ts.linter || require('gulp-tslint'),
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
									.pipe(tslint(options.ts.rulesFile))
									.pipe(tslint.report(tsReporter.reporter, {
							          emitError: false,
						              sort: true,
						              bell: true,
						              fullPath: true
						          	}))
									.on('end', tsReporter.closeReporter.bind(tsReporter));
					});
					tasks.push(tsTask);
			}

			if (options.callback) {
				return run(tasks, options.callback);
			} else {
				return run(tasks);
			}
		}
}

module.exports = new SonarWebReporters();
