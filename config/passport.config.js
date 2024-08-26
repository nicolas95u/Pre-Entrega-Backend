import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import {
  createHash,
  isValidPassword,
} from "../utils/validator/authentication.utils.js";
import userManager from "../dao/mongoDb/UserManager.js"; // Importar directamente la instancia

const initializePassport = () => {
  const LocalStrategy = local.Strategy;

  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { firstName, lastName, email } = req.body;

          let user = await userManager.findUserByEmail(email); // Ajustar llamada a función

          if (user) {
            return done(null, false);
          }

          const hashedPassword = createHash(password);

          let result = await userManager.registerUser(
            firstName,
            lastName,
            email,
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
              createHash(accessToken) // Puedes cambiar esto si prefieres no usar hash aquí
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

export default initializePassport;
