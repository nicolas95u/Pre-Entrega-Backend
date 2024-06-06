const mongoose = require('mongoose');
const UserManager = require('../dao/mongoDb/UserManager');
const { createHash } = require('../utils/validator/authentication.utils');

describe('UserManager', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de prueba
    try {
      await mongoose.connect('mongodb://localhost:27017/test_db');
    } catch (error) {
      console.error('Error connecting to the database', error);
    }
  }, 60000); // Aumentar el tiempo de espera a 60 segundos

  afterAll(async () => {
    // Limpiar la base de datos y desconectar
    try {
      await mongoose.connection.dropDatabase(); // Actualizar llamada a dropDatabase
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting from the database', error);
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
