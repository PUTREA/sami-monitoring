const { ROLES, ERROR_MESSAGES } = require('../utils/utils')
const jwt = require('jsonwebtoken');

// // Definisi hierarki role
// const ROLE_HIERARCHY = {
//   'teknisi': 1,
//   'line leader': 2,
//   'supervisor': 3
// };

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header tidak valid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validasi role
    const userRole = decoded.role?.toLowerCase();

    if (!ROLES.HIERARCHY[userRole]) {
      console.log(userRole);
      return res.status(403).json({
        error: ERROR_MESSAGES.AUTH.ROLE_FORBIDDEN(Object.keys(ROLES.HIERARCHY))
      });
    }
    
    // Assign role yang sudah dinormalisasi
    req.user = {
      ...decoded,
      role: userRole
    };
    
    next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' 
      ? ERROR_MESSAGES.AUTH.TOKEN_EXPIRED 
      : ERROR_MESSAGES.AUTH.TOKEN_INVALID;
    res.status(401).json({ error: message });
  }
};

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const roleHierarchy = ROLES.HIERARCHY;

    // Validasi requiredRole
    if (!roleHierarchy[requiredRole]) {
      return res.status(500).json({
        error: ERROR_MESSAGES.AUTH.CONFIG_ERROR
      });
    }

    // Validasi user role
    if (!userRole || !roleHierarchy[userRole]) {
      return res.status(403).json({
        error: ERROR_MESSAGES.AUTH.ROLE_INVALID
      });
    }

    // Cek hierarki
    if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
      console.log(userRole);
      return res.status(403).json({
        error: ERROR_MESSAGES.AUTH.ROLE_FORBIDDEN([requiredRole])
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };