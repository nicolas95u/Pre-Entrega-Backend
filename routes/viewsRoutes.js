import express from "express";
import viewsController from "../controllers/viewsController.js";
import isAdmin from '../middlewares/validation/isAdmin.middleware.js';

const router = express.Router();

router.get("/register", viewsController.renderRegister);
router.get("/login", viewsController.renderLogin);
router.get("/profile", viewsController.renderProfile);
router.get("/", viewsController.renderHome);
router.get("/realtimeproducts", viewsController.renderRealTimeProducts);
router.get('/admin/users', isAdmin, viewsController.renderUserManagement);
router.get('/products', viewsController.renderProducts);
router.get('/cart', viewsController.renderCart); 

export default router;
