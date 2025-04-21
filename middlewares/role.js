const { ROLES, ERROR_MESSAGES } = require('../utils/utils')

// Middleware check role spesifik
const requireRole = (requiredRole) => {
  const userRole = req.user.role;
  const userLevel = ROLES.HIERARCHY[userRole];
  const requiredLevel = ROLES.HIERARCHY[requiredRole];
  return (req, res, next) => {
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: ERROR_MESSAGES.AUTH.ROLE_FORBIDDEN([requiredRole])
      });
    }

    next();
  };
};

module.exports = { requireRole };