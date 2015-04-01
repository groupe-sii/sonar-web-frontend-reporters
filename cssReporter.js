var Model = require('./reporterModel'),
    fs = require('fs'),
    map = require('map-stream'),
    inherits = require('util').inherits;

function CSSReporter(reportFile) {
    Model.call(this, reportFile);
}

inherits(CSSReporter, Model);

CSSReporter.prototype.reporter = function(file) {
    var fileNbViolations = this.openFileIssues(file, /^(\s+)?\/\*.*\*\//gm, /^(\s+)?\n$/gm),
        d = (new Date()).getTime(),
        severity,
        nbViol = file.csslint.errorCount,
        self = this;
    file.csslint.results.forEach(function(result, index) {
        var message = result.error;
        switch (message.type) {
            case 'error':
                severity = 'MAJOR';
                self.nbViolations[self.MAJOR]++;
                fileNbViolations[self.MAJOR]++;
                break;
            case 'warning':
                severity = 'MINOR';
                self.nbViolations[self.MINOR]++;
                fileNbViolations[self.MINOR]++;
                break;
            default:
                severity = 'INFO';
                self.nbViolations[self.INFO]++;
                fileNbViolations[self.INFO]++;
                break;
        }

        fs.appendFileSync(self.reportFile, '{\n\t\t"line" : ' + (message.line ? message.line : null) + ',\n\t\t' +
            '"message" : "' + message.message + '",\n\t\t' +
            '"description" : "' + message.rule.desc + '",\n\t\t' +
            '"rulekey" : "' + message.rule.id + '",\n\t\t' +
            '"severity" : "' + severity + '",\n\t\t' +
            '"reporter" : "csslint",\n\t\t' +
            '"creationDate" : ' + d + '\n\t\t' + ((index < nbViol - 1) ? '},' : '}'));
    });

    this.closeFileIssues(fileNbViolations);
};

module.exports = CSSReporter;
