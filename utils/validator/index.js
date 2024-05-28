const {
  validateArrayOfStrings,
  validateArrayProducts,
} = require("./array.utils");
const { validateTrue } = require("./boolean.utils");
const { validateNumber } = require("./number.utils");
const { validateString } = require("./string.utils");
const { validateObjectId } = require("./objectId.utils");
const { createHash, isValidPassword } = require("./authentication.utils");

module.exports = {
  validateArrayOfStrings,
  validateArrayProducts,
  validateTrue,
  validateNumber,
  validateString,
  validateObjectId,
  createHash,
  isValidPassword,
};
