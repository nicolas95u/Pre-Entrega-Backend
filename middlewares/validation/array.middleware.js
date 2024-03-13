const {
  validateArrayOfStrings,
  validateArrayProducts,
} = require("../../utils/validator/array.utils");

const validateArrayOfStringsField = (field) => (req, res, next) => {
  const array = req.body[field];
  if (array?.length > 0) {
    const isValid = validateArrayOfStrings(array);

    if (!isValid) {
      return res
        .status(400)
        .send({ error: "Input must be an array of non-empty strings." });
    }
  }
  next();
};

const validateArrayOfProducts = (field) => (req, res, next) => {
  const array = req.body[field];
  if (array.length > 0) {
    const isValid = validateArrayProducts(array);

    if (!isValid) {
      return res
        .status(400)
        .send({ error: "Input must be an array of products." });
    }
  }
  next();
};

module.exports = { validateArrayOfStringsField, validateArrayOfProducts };
