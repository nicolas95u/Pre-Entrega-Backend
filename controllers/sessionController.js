import logger from "../config/logger.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import passport from "passport";

const register = async (req, res) => {
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

const failRegister = (req, res) => {
  logger.warn("Fail register endpoint hit");
  res.status(400).json({ error: "Registration failed" });
};

const login = (req, res) => {
  logger.info(`User logged in: ${req.user.email}`);
  res.status(200).json({ message: "Login successful" });
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
    logger.info("User logged out successfully");
    res.status(200).json({ message: "Logout successful" });
  });
};

const githubAuth = passport.authenticate("github");

const githubCallback = passport.authenticate("github", { failureRedirect: "/session/faillogin" });

const githubCallbackSuccess = (req, res) => {
  logger.info(`GitHub login successful for user: ${req.user.email}`);
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

export default {register,failRegister,login,failLogin,adminOnlyRoute,logout,githubCallbackSuccess,getCurrentUser,githubAuth,githubCallback}