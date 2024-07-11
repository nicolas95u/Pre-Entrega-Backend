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
const logger = require('./config/logger'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

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

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

connectToDatabase(process.env.MONGO_URL);

const mainRouter = require("./routes/mainRouter");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/", mainRouter);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

const mockProducts = require("./utils/validator/mocking");
app.use("/mockingproducts", mockProducts);

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Documentación de la API de E-commerce',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

socketHandler(io);

app.use(errorHandler);

const PORT = 8080;

logger.info(`Server is starting on port ${PORT}`);
server.listen(PORT, () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});
