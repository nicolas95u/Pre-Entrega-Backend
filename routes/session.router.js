const express = require('express');
const router = express.Router();
const UserManager = require('../dao/user-manager');
const isAdmin = require('../middlewares/isAdmin');

const userManager = new UserManager();

// Método para registrar un usuario
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, age, password } = req.body;
    await userManager.registerUser(firstName, lastName, email, age, password);
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Método para realizar el login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const isValidCredentials = await userManager.verifyCredentials(email, password);
    if (!isValidCredentials) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = await userManager.findUserByEmail(email);
    // Setear la sesión del usuario
    req.session.user = user;
    res.status(200).json({ message: 'Login exitoso', user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Ruta protegida para administradores
router.get('/adminOnlyRoute', isAdmin, (req, res) => {
  res.json({ message: 'Acceso permitido para administradores' });
});

// Método para cerrar sesión
router.get('/logout', async (req, res) => {
  try {
    // Destruir la sesión
    req.session.destroy();
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
});

module.exports = router;
