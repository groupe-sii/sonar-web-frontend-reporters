var Model = require('./reporterModel'),
    fs = require('fs'),
    map = require('map-stream'),
    inherits = require('util').inherits;

function JSReporter(reportFile) {
    Model.call(this, reportFile);
    global.selfJSR = this;
}

inherits(JSReporter, Model);

JSReporter.prototype.reporter = map(function(file, cb) {
    var fileNbViolations = global.selfJSR.openFileIssues(file, null, /^(\s+)?\n$/gm);
    if (!file.jshint.success) {
        var errorCount = file.jshint.results.length,
            plural = errorCount === 1 ? '' : 's',
            d = (new Date()).getTime(),
            severity;
        file.jshint.results.forEach(function(result, index) {
            var message = result.error;

            switch (message.id) {
                case '(error)':
                    severity = 'MAJOR';
                    global.selfJSR.nbViolations[global.selfJSR.MAJOR]++;
                    fileNbViolations[global.selfJSR.MAJOR]++;
                    break;
                case undefined:
                    severity = 'BLOCKER';
                    global.selfJSR.nbViolations[global.selfJSR.BLOCKER]++;
                    fileNbViolations[global.selfJSR.BLOCKER]++;
                    break;
                default:
                    severity = 'INFO';
                    global.selfJSR.nbViolations[global.selfJSR.INFO]++;
                    fileNbViolations[global.selfJSR.INFO]++;
                    break;
            }
            fs.appendFileSync(global.selfJSR.reportFile, '{\n\t\t"line" : ' + message.line + ',\n\t\t' +
                '"message" : "' + message.reason.replace(/["']/g, '\'') + '",\n\t\t' +
                '"description" : "' + message.raw.replace(/["']/g, '\'') + '",\n\t\t' +
                '"rulekey" : "' + message.code + '",\n\t\t' +
                '"severity" : "' + severity + '",\n\t\t' +
                '"reporter" : "jshint",\n\t\t' +
                '"creationDate" : ' + d + '\n\t\t' + ((index < errorCount - 1) ? '},' : '}'));
        });
    }
    global.selfJSR.closeFileIssues(fileNbViolations);
    cb(null, file);
});
module.exports = JSReporter;
