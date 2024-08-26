import logger from "../config/logger.js";
import passport from "passport";

const register = async (req, res) => {
  logger.info(`User register: ${req.user.email}`);
  res.status(201).redirect("/login");
};

const failRegister = (req, res) => {
  logger.warn("Fail register endpoint hit");
  res.status(400).json({ error: "Registration failed" });
};

const login = (req, res) => {
  const { user } = req;
  logger.info(`User logged in: ${user.email}`);
  req.session.user = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role // Asegurando que el rol del usuario se guarde en la sesión
  };
  res.status(200).redirect("/profile");
};

const failLogin = (req, res) => {
  logger.warn("Fail login endpoint hit");
  res.status(400).json({ error: "Login failed" });
};

const adminOnlyRoute = (req, res) => {
  logger.info(`Admin route accessed by: ${req.user.email}`);
  res.status(200).json({ message: "Admin route accessed" });
};

const logout = (req, res) => {
  req.logout(err => {
    if (err) {
      logger.error("Error during logout: ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    req.session.destroy(err => {
      if (err) {
        logger.error("Error destroying session: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      logger.info("User logged out successfully");
      res.status(200).redirect("/login");
    });
  });
};

const githubAuth = passport.authenticate("github");

const githubCallback = passport.authenticate("github", { failureRedirect: "/session/faillogin" });

const githubCallbackSuccess = (req, res) => {
  logger.info(`GitHub login successful for user: ${req.user.email}`);
  req.session.user = {
    firstName: req.user.firstName || req.user.username,
    lastName: req.user.lastName || "",
    email: req.user.email,
    role: req.user.role 
  };
  res.redirect("/profile");
};

const getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    logger.info(`Current user: ${req.user.email}`);
    res.status(200).json(req.user);
  } else {
    logger.warn("No authenticated user found");
    res.status(401).json({ error: "Not authenticated" });
  }
};

export default {
  register,
  failRegister,
  login,
  failLogin,
  adminOnlyRoute,
  logout,
  githubCallbackSuccess,
  getCurrentUser,
  githubAuth,
  githubCallback,
};
