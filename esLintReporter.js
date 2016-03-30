var Model = require('./reporterModel'),
    fs = require('fs'),
    path = require('path'),
    map = require('map-stream'),
    q = require('q'),
    os = require('os'),
    inherits = require('util').inherits,

    BASE_PROJECT = path.normalize(__dirname.substring(0, __dirname.indexOf('/node_')+1));

function ESLintReporter(reportFile, base) {
    Model.call(this, reportFile);
    global.selfESR = this;
    global.selfESR.base = BASE_PROJECT + base + path.sep;
}

inherits(ESLintReporter, Model);

ESLintReporter.prototype.reporter = function(results) {

    var readFile = function(file) {
        var _d = q.defer();
        fs.readFile(file, 'utf8', function(err, data) {
            if (err) {
                _d.reject();
            } else {
                _d.resolve(data);
            }
        });
        return _d.promise;
    },
    i = 0,
    len = results.length,

    loop = function() {
        var file = results[i];
        readFile(file.filePath).then(function(data) {
            var fileNbViolations = global.selfESR.openFileIssues({
                    path : BASE_PROJECT + file.filePath,
                    contents: data,
                    base: global.selfESR.base
                }, null, /^(\s+)?\n$/gm),
                errorCount = file.messages.length,
                d = (new Date()).getTime(),
                severity,
                ruleId;

            file.messages.forEach(function(message, index) {

                //0 - none, 1 - warning, 2 - error
                switch (message.severity) {
                    case 2:
                        severity = 'CRITICAL';
                        global.selfESR.nbViolations[global.selfESR.CRITICAL]++;
                        fileNbViolations[global.selfESR.CRITICAL]++;
                        break;
                    case 1:
                        severity = 'MAJOR';
                        global.selfESR.nbViolations[global.selfESR.MAJOR]++;
                        fileNbViolations[global.selfESR.MAJOR]++;
                        break;
                    default:
                        severity = 'INFO';
                        global.selfESR.nbViolations[global.selfESR.INFO]++;
                        fileNbViolations[global.selfESR.INFO]++;
                        break;
                }
                ruleId = message.ruleId.replace('angular/', '');
                fs.appendFileSync(global.selfESR.reportFile, '{\n\t\t"line" : ' + message.line + ',\n\t\t' +
                    '"message" : "' + message.message.replace(/["']/g, '\'') + '",\n\t\t' +
                    '"description" : "",\n\t\t' +
                    '"rulekey" : "ng_' + ruleId.replace(/-/g, '_') + '",\n\t\t' +
                    '"severity" : "' + severity + '",\n\t\t' +
                    '"reporter" : "eslint",\n\t\t' +
                    '"creationDate" : ' + d + '\n\t\t' + ((index < errorCount - 1) ? '},' : '}'));
            });

            global.selfESR.closeFileIssues(fileNbViolations);

            if (i < (len - 1)) {
                i++;
                loop();
            } else {
                global.selfESR.closeReporter();
            }
        });
    };

    loop();

};
module.exports = ESLintReporter;
