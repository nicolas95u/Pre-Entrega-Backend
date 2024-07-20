import express from 'express';
import logger from '../config/logger.js';

const router = express.Router();

router.get('/', (req, res) => {
  logger.info('GET / - Homepage');
  res.render('home', { title: 'Home' });
});

router.get('/about', (req, res) => {
  logger.info('GET /about - About Page');
  res.render('about', { title: 'About' });
});

router.get('/contact', (req, res) => {
  logger.info('GET /contact - Contact Page');
  res.render('contact', { title: 'Contact' });
});

export default router;
