var Model = require('./reporterModel'),
    fs = require('fs'),
    inherits = require('util').inherits;

function TSLintReporter(reportFile) {
    Model.call(this, reportFile);
    global.selfJSR = this;
}

inherits(TSLintReporter, Model);

TSLintReporter.prototype.reporter = function(errors, file) {
    var fileNbViolations = global.selfJSR.openFileIssues(file, null, /^(\s+)?\n$/gm),
        errorCount = errors.length,
        d = (new Date()).getTime(),
        self = this,
        severity = 'INFO';

    errors.forEach(function(error, index) {
        global.selfJSR.nbViolations[global.selfJSR.INFO]++;
        fileNbViolations[global.selfJSR.INFO]++;

        fs.appendFileSync(global.selfJSR.reportFile, '{\n\t\t"line" : ' + error.startPosition.line + ',\n\t\t' +
            '"col" : ' + error.startPosition.character + ',\n\t\t' +
            '"message" : "' + error.failure.replace(/["']/g, '\'') + '",\n\t\t' +
            '"description" : "' + error.failure.replace(/["']/g, '\'') + '",\n\t\t' +
            '"rulekey" : "' + error.ruleName + '",\n\t\t' +
            '"severity" : "' + severity + '",\n\t\t' +
            '"reporter" : "tslint",\n\t\t' +
            '"creationDate" : ' + d + '\n\t\t' + ((index < errorCount - 1) ? '},' : '}'));
    });
    global.selfJSR.closeFileIssues(fileNbViolations);
};
module.exports = TSLintReporter;
