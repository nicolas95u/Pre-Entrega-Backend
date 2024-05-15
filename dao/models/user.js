const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  githubId: { type: String }, // Campo para el ID de usuario de GitHub
  githubAccessToken: { type: String }, // Campo para el token de acceso de GitHub
});

const User = mongoose.model('User', userSchema);

module.exports = User;
