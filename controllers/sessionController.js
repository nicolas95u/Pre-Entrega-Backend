const logger = require("../config/logger");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      logger.warn(`User already exists: ${email}`);
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ email, password: hashedPassword });
    await user.save();

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Error in register: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.failRegister = (req, res) => {
  logger.warn("Fail register endpoint hit");
  res.status(400).json({ error: "Registration failed" });
};

exports.login = (req, res) => {
  logger.info(`User logged in: ${req.user.email}`);
  res.status(200).json({ message: "Login successful" });
};

exports.failLogin = (req, res) => {
  logger.warn("Fail login endpoint hit");
  res.status(400).json({ error: "Login failed" });
};

exports.adminOnlyRoute = (req, res) => {
  logger.info(`Admin route accessed by: ${req.user.email}`);
  res.status(200).json({ message: "Admin route accessed" });
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) {
      logger.error("Error during logout: ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    logger.info("User logged out successfully");
    res.status(200).json({ message: "Logout successful" });
  });
};

exports.githubAuth = passport.authenticate("github");

exports.githubCallback = passport.authenticate("github", { failureRedirect: "/session/faillogin" });

exports.githubCallbackSuccess = (req, res) => {
  logger.info(`GitHub login successful for user: ${req.user.email}`);
  res.redirect("/profile");
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    logger.info(`Current user: ${req.user.email}`);
    res.status(200).json(req.user);
  } else {
    logger.warn("No authenticated user found");
    res.status(401).json({ error: "Not authenticated" });
  }
};
