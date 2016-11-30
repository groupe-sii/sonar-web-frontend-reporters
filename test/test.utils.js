const fs = require('fs');

module.exports = {
  readJSONFile (path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }
};
