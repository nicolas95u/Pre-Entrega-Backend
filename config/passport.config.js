const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2").Strategy; // Importar GitHubStrategy
const { createHash, isValidPassword } = require("../utils/validator/authentication.utils");
const UserManager = require("../dao/mongoDb/UserManager");
const userManager = new UserManager();

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

          let user = await userManager.findUserByEmail({ email });

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
          return done("Error al obtener el usuario: " + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userManager.findUserById({ id });
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await userManager.findUserByEmail({ email });
        if (!user) {
          console.log("User doesn't exist");
          return done(null, false);
        }
        if (!isValidPassword(user, password)) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Iniciar la estrategia de GitHub
  const CLIENT_ID = "Iv1.2e71bcd0f250d34c";
  const SECRET_ID = "ddcfb192c6f2730dffb9354d4b06ed2ac9bb1d84";

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: SECRET_ID,
        callbackURL: "http://localhost:8080/session/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile._json);
          console.log (accessToken, refreshToken)
    
          let user = await userManager.findUserByEmail({ email: profile._json.login });
          if (!user) {
            
            const fullName=profile._json.name.split(" ")
            console.log(fullName)
            let result = await userManager.registerUser(fullName[0], fullName[1], profile._json.email, Math.random(), accessToken); // Aquí puedes pasar los datos que tengas disponibles de GitHub
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
