// karma.conf.js 
module.exports = function(config) {
  config.set({
  	// base path that will be used to resolve all patterns (eg. files, exclude)
  	basePath: '../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['bower','jasmine'],
 

    bowerPackages: [
        'angular',
        'angular-mocks',
        'jquery',
        'angular-animate',
        'angular-cookies',
        'angular-touch',
        'angular-sanitize',
        'restangular',
        'angular-ui-router',
        'bootstrap-sass-official',
        'angular-bootstrap',
        'moment',
        'animate.css',
        'bootstrap-css',
        'angularjs-slider',
        'angular-ui-switch',
        'angular-datepicker',
        'swiper',
        'highcharts-release',
        'ngDialog',
        'ngstorage',
        'ngCordova',
        'lodash',
        'js-ng-img-crop',
        'ngFitText'
    ],
 	// list of files / patterns to load in the browser
    files: [
    	// bower:js
    	//'./bower_components/**/angular.js',
    	//'./bower_components/**/angular-animate.js',
    	//'./bower_components/**/angular-cookies.js',
    	//'./bower_components/**/angular-touch.js',
    	//'./bower_components/**/angular-sanitize.js',
    	//'./bower_components/**/restangular.js',
    	//'./bower_components/**/angular-ui-router.js',
    	//'./bower_components/**/ui-bootstrap.js',
    	//'./bower_components/**/angular-ui-switch.js',
    	//'./bower_components/**/angular-datepicker.js',
    	//'./bower_components/**/ngdialog.js',
    	//'./bower_components/**/ngStorage.min.js',
    	//'./bower_components/**/ng-img-crop.js',
    	//'./bower_components/**/ng-FitText.js',
        'bower_components/angular-i18n/angular-locale_fr-fr.js',
     	// endbower
     	// 
        'test/jasmine/src/index.src.js',
	//'./src/app/common/services/notification.service.js',
	'src/app/common/**/*.js',
	//'./test/mock/**/*.js',
	'test/jasmine/spec/app/common/**/*.js',

        //'./test/jasmine/spec/app/test.spec.js'
    ],

    // list of files to exclude
    exclude: [

    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
	'src/app/common/services/notification.service.js' : 'coverage',
	'src/app/common/services/awards.service.js' : 'coverage'
    },

    plugins: [
	'karma-jasmine'
	//, 'karma-junit-reporter'
    , 'karma-junit7-sonarqube-reporter'
	, 'ec-karma-junit-reporter23'
	, 'karma-coverage'
	, 'karma-bower'
	, 'karma-phantomjs-launcher'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit', 'coverage'],

    junitReporter: {
	outputFile: 'ic/report/tr.xml',
	suite: ''
    },

    coverageReporter : {
      type : 'lcov',
      dir : 'ic/coverage/',
      subdir: 'report'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
         'PhantomJS'
        // , 'Chrome'
        // , 'Firefox'
        // , 'Safari'
    ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false

  });
};
