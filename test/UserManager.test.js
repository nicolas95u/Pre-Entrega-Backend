import mongoose from 'mongoose';
import UserManager from '../dao/mongoDb/UserManager.js';
import { createHash } from '../utils/validator/authentication.utils.js';
import logger from '../config/logger.js';

describe('UserManager', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de prueba
    try {
      await mongoose.connect('mongodb://localhost:27017/test_db');
    } catch (error) {
      logger.error('Error connecting to the database', error);
    }
  }, 60000); // Aumentar el tiempo de espera a 60 segundos

  afterAll(async () => {
    // Limpiar la base de datos y desconectar
    try {
      await mongoose.connection.dropDatabase(); // Actualizar llamada a dropDatabase
      await mongoose.disconnect();
    } catch (error) {
      logger.error('Error disconnecting from the database', error);
    }
  }, 60000); // Aumentar el tiempo de espera a 60 segundos

  test('should register a new user', async () => {
    const newUser = await UserManager.registerUser(
      'Test',
      'User',
      'testuser@example.com',
      25,
      createHash('password123')
    );

    expect(newUser).toHaveProperty('_id');
    expect(newUser.email).toBe('testuser@example.com');
  });

  test('should find a user by email', async () => {
    const user = await UserManager.findUserByEmail('testuser@example.com');
    expect(user).not.toBeNull();
    expect(user.email).toBe('testuser@example.com');
  });

  test('should verify user credentials', async () => {
    const isValid = await UserManager.verifyCredentials('testuser@example.com', 'password123');
    expect(isValid).toBe(true);
  });
});
