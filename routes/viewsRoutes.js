const express = require("express");
const router = express.Router();
const viewsController = require("../controllers/viewsController");

router.get("/register", viewsController.renderRegister);
router.get("/login", viewsController.renderLogin);
router.get("/profile", viewsController.renderProfile);
router.get("/", viewsController.renderHome);
router.get("/realtimeproducts", viewsController.renderRealTimeProducts);

module.exports = router;
