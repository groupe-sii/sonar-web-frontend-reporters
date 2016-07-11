var Model = require('./reporterModel'),
    fs = require('fs'),
    map = require('map-stream'),
    inherits = require('util').inherits;

function HTMLReporter(reportFile) {
    Model.call(this, reportFile);
}

inherits(HTMLReporter, Model);

HTMLReporter.prototype.reporter = function(file) {
    var fileNbViolations = this.openFileIssues(file, null, /^(\s+)?\n$/gm),
        d = (new Date()).getTime(),
        severity,
        errorCount = file.htmlhint.errorCount,
        self = this,
        d = (new Date()).getTime(),
        severity;

    file.htmlhint.messages.forEach(function(result, index) {
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
        fs.appendFileSync(self.reportFile, '{\n\t\t"line" : ' + message.line + ',\n\t\t' +
            '"message" : ' + JSON.stringify(message.message) + ',\n\t\t' +
            '"description" : ' + JSON.stringify(message.rule.description) + ',\n\t\t' +
            '"rulekey" : "' + message.rule.id + '",\n\t\t' +
            '"severity" : "' + severity + '",\n\t\t' +
            '"reporter" : "htmlhint",\n\t\t' +
            '"creationDate" : ' + d + '\n\t\t' + ((index < errorCount - 1) ? '},' : '}'));
    });

    this.closeFileIssues(fileNbViolations);
};

module.exports = HTMLReporter;
