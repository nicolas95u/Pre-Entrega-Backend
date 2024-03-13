const { validateString } = require("../../utils/validator/string.utils");

const validateStringFields = (fields) => (req, res, next) => {
  const valuesToValidate = fields.map((field) => req.body[field]);

  const isValid = validateString(valuesToValidate);

  if (!isValid) {
    return res
      .status(400)
      .send({ error: "All specified fields must be non-empty strings." });
  }

  next();
};

module.exports = { validateStringFields };
