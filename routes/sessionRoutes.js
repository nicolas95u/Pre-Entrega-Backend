import express from 'express';
import sessionController from '../controllers/sessionController.js';
import isAdmin from '../middlewares/validation/isAdmin.middleware.js';
import isUser from '../middlewares/validation/isUser.middleware.js';
import forgotPasswordController from '../controllers/forgotPasswordController.js';
import passport from 'passport';

const router = express.Router();

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/failregister' }),
  sessionController.register
);

router.get('/failregister', sessionController.failRegister);

router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/session/faillogin' }),
  sessionController.login
);

router.get('/faillogin', sessionController.failLogin);

router.get('/adminOnlyRoute', isAdmin, sessionController.adminOnlyRoute);

router.get('/logout', sessionController.logout);

router.get('/github', sessionController.githubAuth);

router.get(
  '/githubcallback',
  sessionController.githubCallback,
  sessionController.githubCallbackSuccess
);

router.get('/current', isUser, sessionController.getCurrentUser);

router.post('/forgot-password', forgotPasswordController.sendResetPasswordEmail);

router.post('/reset-password/:token', forgotPasswordController.resetPassword);

export default router;
