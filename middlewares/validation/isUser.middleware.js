const isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'user') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. User role required.' });
};

export default isUser;
