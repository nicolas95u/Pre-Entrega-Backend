const Message = require("../dao/models/messages");
import logger from '/config/logger';


exports.renderChat = async (req, res) => {
  try {
    const messages = await Message.find(); 
    res.render("chat", { messages });
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error interno del servidor");
  }
};


exports.sendMessage = async (req, res) => {
  const { user, message } = req.body;
  try {
    await Message.create({ user, message }); 
    res.redirect("/chat"); 
  } catch (err) {
    logger.error(err);
    res.status(500).send("Error interno del servidor");
  }
};
