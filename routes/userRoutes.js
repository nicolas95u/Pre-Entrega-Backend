const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAdmin = require("../middlewares/validation/isAdmin.middleware");
const isUser = require("../middlewares/validation/isUser.middleware");

router.put("/premium/:uid", isAdmin, userController.changeUserRole);

module.exports = router;
