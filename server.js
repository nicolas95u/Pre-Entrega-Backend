require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const { initializePassport } = require("./config/passport.config");
const { connectToDatabase } = require("./config/database");
const socketHandler = require("./config/socketHandler");
const errorHandler = require("./utils/validator/errorHandler");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// Configuración de la sesión
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 3600,
    }),
    secret: process.env.MONGO_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Inicializar Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Conectar a la base de datos
connectToDatabase(process.env.MONGO_URL);

// Rutas
const mainRouter = require("./routes/mainRouter");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/", mainRouter);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// Manejo de Socket.IO
socketHandler(io);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
