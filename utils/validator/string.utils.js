const validateString = (strings) => {
  let valid = true;
  strings.forEach((string) => {
    if (typeof string != "string" || string.length == 0) {
      valid = false;
      return;
    }
    return;
  });
  return valid;
};
module.exports = { validateString };
