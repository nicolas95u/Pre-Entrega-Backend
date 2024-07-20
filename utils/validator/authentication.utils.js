const validateAuthentication = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  next();
};

export default validateAuthentication;
