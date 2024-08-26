const validateTrueField = (values) => {
  if (!Array.isArray(values)) {
    throw new TypeError('Expected an array of values');
  }
  return values.every((value) => typeof value === 'boolean');
};

export default validateTrueField;
