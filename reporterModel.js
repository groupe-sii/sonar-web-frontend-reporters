var fs = require('fs'),
    os = require('os'),
    path = require('path'),
    version = '1.1.0';

    BASE_PROJECT = path.normalize(__dirname.substring(0, __dirname.indexOf('/node_')+1));

function ReporterModel(reportFile) {
    this.nbFiles = 0;
    this.nbComments = 0;
    this.nbCloc = 0;
    this.nbLines = 0;
    this.reportFile = reportFile;

    this.nbViolations = [0, 0, 0, 0, 0]; //Blocker/Critical/Major/Minor/Info

};

ReporterModel.prototype.BLOCKER = 0;
ReporterModel.prototype.CRITICAL = 1;
ReporterModel.prototype.MAJOR = 2;
ReporterModel.prototype.MINOR = 3;
ReporterModel.prototype.INFO = 4;

ReporterModel.prototype.openReporter = function(projectName, projectType) {
    fs.writeFileSync(this.reportFile, '{\n' +
        '"language" : "' + projectType + '",\n' +
        '"project" : "' + projectName + '",\n' +
        '"projectPath" : "' + BASE_PROJECT + '",\n' +
        '"version" : "' + version + '",\n' +
        '"files" : [');
};

ReporterModel.prototype.openFileIssues = function(file, commentsRegexp, spaceRegexp) {
    this.nbFiles++;
    var lastSlash = file.path.lastIndexOf(path.sep);
    var str = file.contents.toString();
    var fileNbLines = str.split('\n').length;

    var b = null;
    var c = [],
        d = [];
    if (commentsRegexp) {
        while ((b = commentsRegexp.exec(str)) !== null) {
            c.push(b[0]);
        }
    }
    if (spaceRegexp) {
        while ((b = spaceRegexp.exec(str)) !== null) {
            d.push(b[0]);
        }
    }
    var fileNbComments = c.length;
    var fileNbCloc = fileNbLines - fileNbComments - d.length;
    this.nbLines += fileNbLines;
    this.nbComments += fileNbComments;
    this.nbCloc += fileNbCloc;
    var fileNbViolations = [0, 0, 0, 0, 0];

    var filePath = file.path.substring(file.base.length),
    normalizedFilePath = (os.platform() === 'win32' || os.platform() === 'win64') ? filePath.replace(/\\/g, '\\\\') : filePath;

    fs.appendFileSync(this.reportFile, '\t{\n\t' +
        '"name" : "' + file.path.substring(lastSlash + 1) + '",\n\t' +
        '"path" : "' + normalizedFilePath + '",\n\t' +
        '"nbLines" : ' + fileNbLines + ',\n\t' +
        '"nbComments" : ' + fileNbComments + ',\n\t' +
        '"nbCloc" : ' + fileNbCloc + ',\n\t' +
        '"issues" : [');
    return fileNbViolations;
};

ReporterModel.prototype.closeFileIssues = function(fileNbViolations) {
    fs.appendFileSync(this.reportFile, '],\n\t' +
        '"violations" : {\n\t\t' +
        '"blocker" : ' + fileNbViolations[this.BLOCKER] + ',\n\t\t' +
        '"critical" : ' + fileNbViolations[this.CRITICAL] + ',\n\t\t' +
        '"major" : ' + fileNbViolations[this.MAJOR] + ',\n\t\t' +
        '"minor" : ' + fileNbViolations[this.MINOR] + ',\n\t\t' +
        '"info" : ' + fileNbViolations[this.INFO] + '\n\t}},\n');
};

ReporterModel.prototype.reporter = function() {};

ReporterModel.prototype.closeReporter = function() {
    var buf = fs.readFileSync(this.reportFile);
    if (buf.toString('utf-8', buf.length - 2, buf.length - 1) == ',') {
        buf = buf.slice(0, buf.length - 2); //remove last ,\n from files array : 2 char from buff
    }
    fs.writeFileSync(this.reportFile, buf);
    fs.appendFileSync(this.reportFile, '],\n' +
        '"nbFiles" : ' + this.nbFiles + ',\n' +
        '"nbLines" : ' + this.nbLines + ',\n' +
        '"nbCloc" : ' + this.nbCloc + ',\n' +
        '"nbComments" : ' + this.nbComments + ',\n' +
        '"violations" : {\n\t' +
        '"blocker" : ' + this.nbViolations[this.BLOCKER] + ',\n\t' +
        '"critical" : ' + this.nbViolations[this.CRITICAL] + ',\n\t' +
        '"major" : ' + this.nbViolations[this.MAJOR] + ',\n\t' +
        '"minor" : ' + this.nbViolations[this.MINOR] + ',\n\t' +
        '"info" : ' + this.nbViolations[this.INFO] + '\n\t' + '}\n}');
};

module.exports = ReporterModel;
