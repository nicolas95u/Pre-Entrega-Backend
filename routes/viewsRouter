const express = require('express');
const router = express.Router();

// Vista del formulario de registro
router.get('/register', (req, res) => {
  res.render('register'); // Renderiza la vista register.handlebars
});

// Vista del formulario de login
router.get('/login', (req, res) => {
  res.render('login'); // Renderiza la vista login.handlebars
});

// Vista del perfil del usuario
router.get('/profile', (req, res) => {
  // Verifica si el usuario está autenticado antes de mostrar el perfil
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige al login si el usuario no está autenticado
  }
  // Renderiza la vista profile.handlebars con los datos del usuario
  res.render('profile', { user: req.session.user });
});

module.exports = router;
