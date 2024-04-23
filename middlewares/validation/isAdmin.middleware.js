const isAdmin = (req, res, next) => {
    const { session } = req;
  
    // Verificar si hay una sesión activa
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Verificar si el usuario tiene el rol de administrador
    if (session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    // Verificar si las credenciales del usuario son válidas
    if (
      session.user.email !== 'adminCoder@coder.com' ||
      session.user.password !== 'adminCod3r123'
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    // Si pasa todas las validaciones, continuar con la siguiente función de middleware
    next();
  };
  
  module.exports = isAdmin;
  