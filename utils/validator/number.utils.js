const validateNumberFields = (fields) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (typeof req.body[field] !== 'number') {
        return res.status(400).json({ error: `Invalid field ${field}` });
      }
    }
    next();
  };
};

export default validateNumberFields;
