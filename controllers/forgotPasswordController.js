import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../utils/mailer.js";  // Usar require para importar sendEmail
import logger from "../config/logger.js";

const sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`User not found: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      html: `<a href="${resetLink}">Click here to reset your password</a>`
    });

    logger.info(`Reset link sent successfully to: ${email}`);
    res.status(200).json({ message: "Reset link sent successfully" });
  } catch (error) {
    logger.error("Error in sendResetPasswordEmail: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.warn(`User not found for token: ${token}`);
      return res.status(404).json({ message: "User not found" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      logger.warn("New password cannot be the same as the old password");
      return res.status(400).json({ message: "New password cannot be the same as the old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    logger.info("Password reset successfully");
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      logger.warn("Token expired, please request a new reset link");
      return res.status(400).json({ message: "Token expired, please request a new reset link" });
    }
    logger.error("Error in resetPassword: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {sendResetPasswordEmail,resetPassword}