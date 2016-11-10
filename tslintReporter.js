var Model = require('./reporterModel'),
    fs = require('fs'),
    inherits = require('util').inherits;

function TSLintReporter(reportFile) {
    Model.call(this, reportFile);
    global.selfTSR = this;
}

inherits(TSLintReporter, Model);

TSLintReporter.prototype.reporter = function(errors, file) {
    var fileNbViolations = global.selfTSR.openFileIssues(file, null, /^(\s+)?\n$/gm),
        errorCount = errors.length,
        d = (new Date()).getTime(),
        self = this,
        severity = 'INFO';

    errors.forEach(function(error, index) {
        global.selfTSR.nbViolations[global.selfTSR.INFO]++;
        fileNbViolations[global.selfTSR.INFO]++;

        fs.appendFileSync(global.selfTSR.reportFile, '{\n\t\t"line" : ' + (error.startPosition.line + 1) + ',\n\t\t' +
            '"col" : ' + (error.startPosition.character + 1) + ',\n\t\t' +
            '"message" : "' +  JSON.stringify(error.failure) + '",\n\t\t' +
            '"description" : "' + JSON.stringify(error.failure) + '",\n\t\t' +
            '"rulekey" : "' + error.ruleName + '",\n\t\t' +
            '"severity" : "' + severity + '",\n\t\t' +
            '"reporter" : "tslint",\n\t\t' +
            '"creationDate" : ' + d + '\n\t\t' + ((index < errorCount - 1) ? '},' : '}'));
    });
    global.selfTSR.closeFileIssues(fileNbViolations);
};
module.exports = TSLintReporter;
