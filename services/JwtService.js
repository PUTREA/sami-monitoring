const { JWT, ERROR_MESSAGES } = require('../utils/utils')
const jwt = require('jsonwebtoken');

class JwtService {
  static generateToken(payload) {
    return jwt.sign(payload, JWT.SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT.SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JwtService;