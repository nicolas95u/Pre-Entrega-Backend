const validateTrueField = (field) => {
  return (req, res, next) => {
    if (typeof req.body[field] !== 'boolean') {
      return res.status(400).json({ message: `Invalid ${field}` });
    }
    next();
  };
};

export default validateTrueField;
