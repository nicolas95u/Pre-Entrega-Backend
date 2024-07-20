const validateStringFields = (fields) => {
  return (req, res, next) => {
    for (let field of fields) {
      if (typeof req.body[field] !== 'string' || req.body[field].trim() === '') {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }
    next();
  };
};

export default validateStringFields;
