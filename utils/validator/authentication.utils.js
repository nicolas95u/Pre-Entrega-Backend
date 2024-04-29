const bcrypt = require('bcrypt');
const { fileURLToPath, pathToFileURL } = require('url');
const { dirname } = require('path');

// Function to hash password
exports.createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Function to validate password
exports.isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

// Get the directory name of the current file
const filename = fileURLToPath(pathToFileURL(__filename).href);
const directory = dirname(filename);

// Export the dirname by default
module.exports.default = directory;