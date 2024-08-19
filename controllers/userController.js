import User from '../models/user.js';
import logger from '../config/logger.js';
import nodemailer from 'nodemailer';

export const changeUserRole = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
    const uploadedDocuments = user.documents.map(doc => doc.name);
    const hasRequiredDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

    if (!hasRequiredDocuments) {
      return res.status(400).json({ message: 'El usuario no ha subido todos los documentos requeridos' });
    }

    user.role = 'premium';
    await user.save();

    res.status(200).json({ message: 'Usuario actualizado a premium' });
  } catch (error) {
    logger.error('Error actualizando usuario a premium:', error);
    res.status(500).json({ message: 'Error actualizando usuario a premium' });
  }
};

export const uploadUserDocuments = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const files = req.files;
    files.forEach(file => {
      user.documents.push({ name: file.fieldname, reference: file.path });
    });

    await user.save();
    res.status(200).json({ message: 'Documentos subidos correctamente', documents: user.documents });
  } catch (error) {
    logger.error('Error subiendo documentos:', error);
    res.status(500).json({ message: 'Error subiendo documentos' });
  }
};

export const updateLastConnection = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user) {
      user.last_connection = new Date();
      await user.save();
    }
  } catch (error) {
    logger.error('Error actualizando la última conexión:', error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email role');
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

export const deleteInactiveUsers = async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await User.find({ last_connection: { $lt: twoDaysAgo } });

    inactiveUsers.forEach(async (user) => {
      await User.findByIdAndDelete(user._id);
      await sendDeletionEmail(user.email);
    });

    res.status(200).json({ message: 'Usuarios inactivos eliminados' });
  } catch (error) {
    logger.error('Error al eliminar usuarios inactivos:', error);
    res.status(500).json({ error: 'Error al eliminar usuarios inactivos' });
  }
};

const sendDeletionEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Cuenta eliminada por inactividad',
    text: 'Tu cuenta ha sido eliminada debido a la inactividad en los últimos días.',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Correo enviado:', info.response);
  } catch (error) {
    logger.error('Error al enviar correo:', error);
  }
};
