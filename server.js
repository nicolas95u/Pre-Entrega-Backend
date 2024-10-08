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
import paymentRoutes from './routes/paymentRoutes.js';
import mainRouter from './routes/mainRouter.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import viewsRoutes from './routes/viewsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { initiatePayment } from './controllers/paymentController.js';
import path from 'path';
import { fileURLToPath } from 'url'; // Importamos fileURLToPath para manejar __dirname

// Obtener __dirname para usar en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', engine({helpers: {
  json: function (context) {
    return JSON.stringify(context);
  },
}}));
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

// Configuración para servir archivos estáticos
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/', mainRouter);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes); 
app.use('/api/payments', paymentRoutes);
app.use('/session', sessionRoutes);
app.use('/', viewsRoutes);
app.use('/api/users', userRoutes);

app.post('/checkout', initiatePayment);

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

export default app;
