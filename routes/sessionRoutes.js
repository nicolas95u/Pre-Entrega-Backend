const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const isAdmin = require("../middlewares/validation/isAdmin.middleware");
const isUser = require("../middlewares/validation/isUser.middleware"); // Importar middleware isUser
const passport = require("passport");
const forgotPasswordController = require('../controllers/forgotPasswordController');


router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  sessionController.register
);

router.get("/failregister", sessionController.failRegister);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/session/faillogin" }),
  sessionController.login
);

router.get("/faillogin", sessionController.failLogin);

router.get("/adminOnlyRoute", isAdmin, sessionController.adminOnlyRoute);

router.get("/logout", sessionController.logout);

router.get("/github", sessionController.githubAuth);

router.get(
  "/githubcallback",
  sessionController.githubCallback,
  sessionController.githubCallbackSuccess
);

router.get("/current", isUser, sessionController.getCurrentUser); 

router.post('/forgot-password', forgotPasswordController.sendResetPasswordEmail); // Corregido el nombre de la función

router.post('/reset-password/:token', forgotPasswordController.resetPassword); // Añadida la ruta para resetear la contraseña

module.exports = router;
