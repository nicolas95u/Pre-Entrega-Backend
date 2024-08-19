const express = require("express");
const router = express.Router();
const Message = require("./message");
import logger from '/config/logger';

// Endpoint para recibir y guardar mensajes
router.post("/messages", async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = new Message({ user: user, message: message });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    logger.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
});

module.exports = router;
