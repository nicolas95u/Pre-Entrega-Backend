const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const isAdmin = require("../middlewares/validation/isAdmin.middleware");
const isUser = require("../middlewares/validation/isUser.middleware"); // Importar middleware isUser
const passport = require("passport");

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

router.get("/current", isUser, sessionController.getCurrentUser); // Usar middleware isUser

module.exports = router;
