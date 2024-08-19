const isAdmin = (req, res, next) => {
  const { session } = req;

  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

export default isAdmin;
