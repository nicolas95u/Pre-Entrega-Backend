const Message = require("../dao/models/messages");

// Controlador para renderizar la vista del chat
exports.renderChat = async (req, res) => {
  try {
    const messages = await Message.find(); // Obtén todos los mensajes de la base de datos
    res.render("chat", { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
  }
};

// Controlador para procesar los mensajes enviados por los usuarios
exports.sendMessage = async (req, res) => {
  const { user, message } = req.body;
  try {
    await Message.create({ user, message }); // Crea un nuevo mensaje en la base de datos
    res.redirect("/chat"); // Redirige de vuelta al chat después de enviar el mensaje
  } catch (err) {
    console.error(err);
    res.status(500).send("Error interno del servidor");
  }
};
