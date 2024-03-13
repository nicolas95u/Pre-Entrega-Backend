const validateNumber = (numbers) => {
  let valid = true;
  numbers.forEach((number) => {
    if (typeof number != "number" || number <= 0) {
      valid = false;
      return;
    }
    return;
  });
  return valid;
};

module.exports = { validateNumber };
