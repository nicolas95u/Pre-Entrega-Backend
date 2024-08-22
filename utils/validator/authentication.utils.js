import bcrypt from "bcrypt";
const validateAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  next();
};

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (user, password) =>
  bcrypt.compare(password, user.password);

export { validateAuthentication, createHash, isValidPassword };
