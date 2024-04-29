const express = require('express');
const router = express.Router();
const UserManager = require('../dao/mongoDb/UserManager');
const isAdmin = require('../middlewares/validation/isAdmin.middleware');
const { createHash } = require('../utils/validator/authentication.utils');
const passport=require ("passport")
const userManager = new UserManager();

// Método para registrar un usuario
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
  try {
  
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


router.get('/failregister', async (req, res) => {
  console.log("Failed Strategy!");
  res.send({ error: "Failed" })
})

// Método para realizar el login
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
  try {
    if (!req.user) return res.status(400).send({ status: "error", error: "Invalid credentials" })
    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email
    }
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

router.get('/faillogin', (req, res) => {
  res.send({ error: "Failed Login" })
})

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
