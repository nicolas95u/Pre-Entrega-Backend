const bcrypt = require("bcrypt");
const { fileURLToPath, pathToFileURL } = require("url");
const { dirname } = require("path");

exports.createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

exports.isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const filename = fileURLToPath(pathToFileURL(__filename).href);
const directory = dirname(filename);

module.exports.default = directory;
