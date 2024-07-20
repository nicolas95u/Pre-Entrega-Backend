import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { connectToDatabase } from './config/database.js';
import socketHandler from './config/socketHandler.js';
import errorHandler from './utils/validator/errorHandler.js';
import logger from './config/logger.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

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

import mainRouter from './routes/mainRouter.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

app.use('/', mainRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

import mockProducts from './utils/validator/mocking.js';
app.use('/mockingproducts', mockProducts);

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
