const UserManager = require("../dao/mongoDb/UserManager");
const passport = require("passport");

const userManager = new UserManager();

exports.register = async (req, res) => {
  try {
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

exports.failRegister = async (req, res) => {
  console.log("Failed Strategy!");
  res.send({ error: "Failed" });
};

exports.login = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    req.session.user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      age: req.user.age,
      email: req.user.email,
    };
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

exports.failLogin = (req, res) => {
  res.send({ error: "Failed Login" });
};

exports.adminOnlyRoute = (req, res) => {
  res.json({ message: "Acceso permitido para administradores" });
};

exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.status(200).json({ message: "Sesión cerrada correctamente" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};

exports.githubAuth = passport.authenticate("github", { scope: ["user:email"] });

exports.githubCallback = passport.authenticate("github", {
  failureRedirect: "/login",
});

exports.githubCallbackSuccess = (req, res) => {
  req.session.user = req.user;
  res.redirect("/");
};

exports.getCurrentUser = (req, res) => {
  const { password, ...user } = req.session.user;
  res.send({ ...user });
};
