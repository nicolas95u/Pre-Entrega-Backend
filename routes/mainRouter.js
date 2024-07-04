const express = require("express");
const router = express.Router();
const productRouter = require("./productRoutes");
const cartRouter = require("./cartRoutes");
const sessionRouter = require("./sessionRoutes");
const userRouter = require("./userRoutes");
const viewsRouter = require("./viewsRoutes");
const logger = require("../config/logger");

router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/session", sessionRouter);
router.use("/users", userRouter);
router.use("/", viewsRouter);

// Endpoint para probar el logger
router.get("/loggerTest", (req, res) => {
  logger.debug('This is a debug log');
  logger.http('This is an http log');
  logger.info('This is an info log');
  logger.warn('This is a warning log');
  logger.error('This is an error log');
  logger.fatal('This is a fatal log');
  
  res.send("Logger test complete, check the logs.");
});

module.exports = router;
