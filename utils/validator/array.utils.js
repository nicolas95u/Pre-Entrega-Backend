const validateArrayOfStringsField = (field) => {
  return (req, res, next) => {
    const value = req.body[field];
    if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
      return res.status(400).json({ error: `Invalid field ${field}` });
    }
    next();
  };
};

export default validateArrayOfStringsField;
