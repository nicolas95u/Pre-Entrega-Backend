const validateTrue = (boolean) => {
  if (typeof boolean != "boolean") {
    return false;
  }
  return boolean;
};

module.exports = { validateTrue };
