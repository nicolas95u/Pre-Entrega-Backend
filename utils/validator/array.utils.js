const { validateString } = require("../../utils/validator/string.utils");
const { validateNumber } = require("../../utils/validator/number.utils");

const validateArrayOfStrings = (array) => {
  if (!Array.isArray(array)) {
    return false;
  }
  return validateString(array);
};
const validateArrayProducts = (array) => {
  if (!Array.isArray(array)) {
    return false;
  }
  let isValid = true;
  array.forEach((elem) => {
    const { product, quantity } = elem;

    if (!validateNumber([product, quantity])) {
      isValid = false;
    }
  });
  return isValid;
};

module.exports = { validateArrayOfStrings, validateArrayProducts };
