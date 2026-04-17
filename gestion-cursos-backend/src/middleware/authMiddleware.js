const jwt = require('jsonwebtoken');

// Verificar token
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ mensaje: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Verificar rol flexible
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    const rol = req.user.rol_id; // viene del token
    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ mensaje: 'No tienes permisos' });
    }
    next();
  };
}

module.exports = { verificarToken, verificarRol };
