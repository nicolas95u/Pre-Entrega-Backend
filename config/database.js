import mongoose from 'mongoose';
import logger from './logger.js';

export const connectToDatabase = async (mongoUrl) => {
  try {
    await mongoose.connect(mongoUrl);
    logger.info('Connected to the database');
  } catch (error) {
    logger.error('Error connecting to the database', error);
    throw error;
  }
};

export default connectToDatabase;
