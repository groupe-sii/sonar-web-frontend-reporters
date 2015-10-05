var Model = require('./reporterModel'),
    fs = require('fs'),
    map = require('map-stream'),
    inherits = require('util').inherits;

function SCSSReporter(reportFile) {
    Model.call(this, reportFile);
    global.selfSCSSR = this;
}

inherits(SCSSReporter, Model);

SCSSReporter.prototype.reporter = function(file, stream) {
    var fileNbViolations = global.selfSCSSR.openFileIssues(file, /^(\s+)?\/\*.*\*\//gm, /^(\s+)?\n$/gm);
    if (!file.scsslint.success) {
        var d = (new Date()).getTime(),
            severity,
            errorCount = file.scsslint.errors + file.scsslint.warnings;

        file.scsslint.issues.forEach(function(result, index) {
            switch (result.severity) {
                case 'warning':
                    severity = 'MINOR';
                    global.selfSCSSR.nbViolations[global.selfSCSSR.MINOR]++;
                    fileNbViolations[global.selfSCSSR.MINOR]++;
                    break;
                case 'error':
                    severity = 'MAJOR';
                    global.selfSCSSR.nbViolations[global.selfSCSSR.MAJOR]++;
                    fileNbViolations[global.selfSCSSR.MAJOR]++;
                    break;
                default:
                    severity = 'INFO';
                    global.selfSCSSR.nbViolations[global.selfSCSSR.INFO]++;
                    fileNbViolations[global.selfSCSSR.INFO]++;
                    break;
            }

            fs.appendFileSync(global.selfSCSSR.reportFile, '{\n\t\t"line" : ' + (result.line ? result.line : null) + ',\n\t\t' +
                '"message" : "' + result.reason.replace(/["']/g, '\'') + '",\n\t\t' +
                '"description" : "' + result.reason.replace(/["']/g, '\'') + '",\n\t\t' +
                '"rulekey" : "' + result.linter + '",\n\t\t' +
                '"severity" : "' + severity + '",\n\t\t' +
                '"reporter" : "scsslint",\n\t\t' +
                '"creationDate" : ' + d + '\n\t\t' + ((index < errorCount - 1) ? '},' : '}'));
        });
    }
    global.selfSCSSR.closeFileIssues(fileNbViolations);
};

module.exports = SCSSReporter;
