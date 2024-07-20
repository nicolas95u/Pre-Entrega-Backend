const validateArrayOfStringsField = (field) => {
  return (req, res, next) => {
    if (!Array.isArray(req.body[field]) || !req.body[field].every(item => typeof item === 'string')) {
      return res.status(400).json({ message: `Invalid ${field}` });
    }
    next();
  };
};

export default validateArrayOfStringsField;
