# front-end-continuous-integration
This is a repo of SII continuous integration build system dedicated to Front-end webapps. This repo provides all the reporters written by SII for the generic [Sonarqube plugin](https://github.com/groupe-sii/sonar-web-client-plugin)

# Informations for Sonarqube
The export file for Sonarqube is a JSON file providing all informations a Sonarqube issue might have :
* Project Description
  * language : The programmation(cough) language of the project (HTML, CSS, JS, whatever)
  * project : The name of the project
  * projectPath : The path to the sources of the project for Sonarqube parsing
  * version : The project version
  * violations : Object summarizing the number of violations in the project sorted by severity
  * nbFiles : Number of scanned files in the project
  * nbLines : Total number of lines in scanned files
  * nbComments : Total number of commented lines in scanned files
  * nbCloc : Total number of lines of code (non empty non comment) in scanned files
  * files : Array of scanned files
* File description
  * name : File name
  * path : File path relative to project's path
  * nbLines : Number of lines in the file
  * nbComments : Number of commented lines in the file
  * nbCloc : Number of lines of code (non empty non comment) in the file
  * violations : Object summarizing the number of violations in the file sorted by severity
  * issues : Array of issues in the file
* Issue description
  * line : The line where the issue occurs in the file
  * message : Summary of the issue
  * description : Long test descrtibing the issue
  * rulekey : The unique identifier of the issue
  * severity : Issue severity (one of INFO,MINOR,MAJOR,CRITICAL,BLOCKER)
  * reporter : Name of the reporter used to generate this issue
  * creationDate : Date of issue creation

# HTML Reporter
Reporter for [HTMLhint](http://htmlhint.com/)
## Usage


# JS Reporter
Reporter for [JShint](http://jshint.com/)
## Usage


# CSS Reporter
Reporter for [CSSlint](http://csslint.net/)
## Usage


# SCSS Reporter
Reporter for [SCSSLint](https://github.com/brigade/scss-lint)
## Usage


#esLintReporter
Reporter for [ESLint angular](https://github.com/Gillespie59/eslint-plugin-angular)
## Usage
