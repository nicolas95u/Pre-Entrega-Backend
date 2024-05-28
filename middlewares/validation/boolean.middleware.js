const { validateTrue } = require("../../utils/validator/boolean.utils");

const validateTrueField = (field) => (req, res, next) => {
  if (!validateTrue(req.body[field])) {
    return res.status(400).send({ error: "Invalid boolean value" });
  }

  next();
};

module.exports = { validateTrueField };
