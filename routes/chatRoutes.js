const express = require("express");
const chatController = require("../controllers/chatController");
const router = express.Router();

// Ruta para renderizar la vista del chat
router.get("/chat", chatController.renderChat);

// Ruta para procesar los mensajes enviados por los usuarios
router.post("/sendMessage", chatController.sendMessage);

module.exports = router;
