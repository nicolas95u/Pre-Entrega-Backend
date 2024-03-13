const { validateNumber } = require("../../utils/validator/number.utils");

const validateNumberFields = (fields) => (req, res, next) => {
  const valuesToValidate = fields.map((field) => req.body[field]);

  if (!Array.isArray(valuesToValidate)) {
    return res.status(400).send({ error: "Input must be an array." });
  }
  const isValid = validateNumber(valuesToValidate);

  if (!isValid) {
    return res
      .status(400)
      .send({ error: "All elements must be positive numbers." });
  }

  next();
};

module.exports = { validateNumberFields };
