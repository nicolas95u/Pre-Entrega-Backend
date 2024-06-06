const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2").Strategy;
const {
  createHash,
  isValidPassword,
} = require("../utils/validator/authentication.utils");
const userManager = require("../dao/mongoDb/UserManager"); // Importar directamente la instancia

exports.initializePassport = () => {
  const LocalStrategy = local.Strategy;

  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, email, age } = req.body;

          let user = await userManager.findUserByEmail(email); // Ajustar llamada a función

          if (user) {
            console.log("User already exists");
            return done(null, false);
          }

          const hashedPassword = createHash(password);

          let result = await userManager.registerUser(
            firstName,
            lastName,
            email,
            age,
            hashedPassword
          );

          return done(null, result);
        } catch (error) {
          return done("Error al registrar el usuario: " + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userManager.findUserById(id); // Ajustar llamada a función
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userManager.findUserByEmail(email); // Ajustar llamada a función
          if (!user) {
            console.log("User doesn't exist");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userManager.findUserByEmail(profile._json.email); // Ajustar llamada a función
          if (!user) {
            let result = await userManager.registerUser(
              profile._json.firstName || profile.username,
              profile._json.lastName || "",
              profile._json.email,
              null, // Age - Puedes pasar cualquier valor aquí
              accessToken // Guardar el token de acceso para GitHub
            );
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
