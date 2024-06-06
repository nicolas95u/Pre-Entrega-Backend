const isUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'user') {
      return next();
    }
    res.status(403).json({ message: 'Acceso denegado' });
  };
  
  module.exports = isUser;
  