const express = require("express");
const router = express.Router();
const productRouter = require("./productRoutes");
const cartRouter = require("./cartRoutes");
const sessionRouter = require("./sessionRoutes");
const viewsRouter = require("./viewsRoutes");

router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/session", sessionRouter);
router.use("/", viewsRouter);

module.exports = router;
