const passport = require("passport");
const local = require("passport-local");
const GitHubStrategy = require("passport-github2").Strategy;
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

  const CLIENT_ID = "Iv1.2e71bcd0f250d34c";
  const CLIENT_SECRET = "ddcfb192c6f2730dffb9354d4b06ed2ac9bb1d84";
  const CALLBACK_URL = "http://localhost:8080/session/githubcallback";

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userManager.findUserByEmail({ email: profile._json.email });
          if (!user) {
            let result = await userManager.registerUser(
              profile._json.firstName,
              profile._json.lastName,
              profile._json.email,
              null, // Age - You can pass any value you want here
              accessToken // Save the access token for GitHub
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
