const express = require('express');
const router = express.Router();
const Message = require('../dao/models/messages'); // Importa el modelo de mensajes

// Ruta para renderizar la vista del chat
router.get('/chat', async (req, res) => {
    try {
        const messages = await Message.find(); // Obtén todos los mensajes de la base de datos
        res.render('chat', { messages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para procesar los mensajes enviados por los usuarios
router.post('/sendMessage', async (req, res) => {
    const { user, message } = req.body;
    try {
        await Message.create({ user, message }); // Crea un nuevo mensaje en la base de datos
        res.redirect('/chat'); // Redirige de vuelta al chat después de enviar el mensaje
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
