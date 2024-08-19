const validateNumberFields = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (typeof req.body[field] !== 'number' || isNaN(req.body[field])) {
        return res.status(400).json({ message: `Invalid ${field}` });
      }
    }
    next();
  };
};

export default validateNumberFields;
