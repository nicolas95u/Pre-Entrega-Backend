import User from '../../models/user.js';

const isUser = async (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'No estás autenticado' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export default isUser;
