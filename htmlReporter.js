var Model = require('./reporterModel'),
fs = require('fs'),
gutil = require('gulp-util'),
map = require('map-stream'),
inherits = require('util').inherits;

function HTMLReporter(reportFile) {
  Model.call(this, reportFile);
}

inherits(HTMLReporter, Model);

HTMLReporter.prototype.reporter = function(file) {
  var fileNbViolations = this.openFileIssues(file, null, /^(\s+)?\n$/gm);

  var d = (new Date()).getTime();
  var severity;
  var errorCount = file.htmlhint.errorCount;
  var self = this;

  var d = (new Date()).getTime();
  var severity;

  file.htmlhint.messages.forEach(function(result, index){
    var message = result.error;
    switch (message.type){
     case 'error':
     severity = 'MAJOR';
     self.nbViolations[self.MAJOR]++;
     fileNbViolations[self.MAJOR]++;
     break;
     case 'warning':
     severity = 'MINOR';
     nbViolations[self.MINOR]++;
     fileNbViolations[self.MINOR]++;
     break;
     default: 
     severity = 'INFO';
     nbViolations[self.INFO]++;
     fileNbViolations[self.INFO]++;
     break;
   }
   fs.appendFileSync(self.reportFile,  '{\n\t\t"line" : ' + message.line + ",\n\t\t"
     + '"message" : "' + message.message  + '",\n\t\t'
     + '"description" : "' + message.rule.description + '",\n\t\t'
     + '"rulekey" : "' + message.rule.id + '",\n\t\t'
     + '"severity" : "' + severity + '",\n\t\t'
     + '"reporter" : "htmlhint",\n\t\t'
     + '"creationDate" : ' + d + '\n\t\t'
     + ((index < errorCount - 1) ? '},' : '}')
     );
 });

  this.closeFileIssues(fileNbViolations);
};

console.log(HTMLReporter.prototype.reporter);
module.exports = HTMLReporter;