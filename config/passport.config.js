const passport = require ("passport");
const local=require ("passport-local")
const {createHash,isValidPassword}=require ("../utils/validator/authentication.utils");
const UserManager = require("../dao/mongoDb/UserManager");
const userManager = new UserManager()


exports.initializePassport = () => {
  const LocalStrategy = local.Strategy;

  // Aquí inicializamos passport con sus propios "middlewares" de acuerdo a cada estrategia
  // Indicaremos la estrategia local

  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true // permite que se pueda acceder al objeto req como cualquier otro middleware.
  }, async (req, username, password, done) => {
    try {
        const {firstName, lastName, email,age} = req.body
        
      let user = await userManager.findUserByEmail({ email });

      if (user) {
        console.log("User already exists");
        return done(null, false);
      }

    const hashedPassword = createHash(password);

      let result = await userManager.registerUser( firstName,
        lastName,
        email,
        age,
hashedPassword )
      // Si todo salió ok, entonces mandaremos done(null, usuarioGenerado)
      return done(null, result);
    } catch (error) {
      // Cuando hay un error, entonces se manda done con el error indicado.
      return done("Error al obtener el usuario: " + error);
    }
  }));
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    let user = await userManager.findUserById({id});
    done(null, user);
  });
  passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
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
  }));
}

