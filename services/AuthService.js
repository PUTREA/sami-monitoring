// services/AuthService.js
const { JWT, ERROR_MESSAGES } = require('../utils/utils')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

class AuthService {
    static async login(email, password) {
        // Validasi input
        if (!email || !password) {
          throw new Error('Email and password are required');
        }
    
        // Cari user dengan role
        const user = await User.findOne({
          where: { email },
          include: [{
            model: Role,
            as: 'Role',
            attributes: ['level']
          }],
          attributes: ['id', 'email', 'password']
        });
    
        if (!user) {
          throw new Error('Invalid credentials');
        }
    
        // Verifikasi password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        // Validasi role
        const validRoles = ['teknisi', 'line leader', 'supervisor'];
        if (!validRoles.includes(user.Role.level.toLowerCase())) {
            throw new Error('Role user tidak valid');
        }
    
        // Generate token
        return {
            token: this.generateToken(user),
            user: {
              id: user.id,
              role: user.Role.level.toLowerCase()
            }
        };
      }
    
      static generateToken(user) {
        return jwt.sign(
          { 
            id: user.id,
            email:user.email,
            role: user.Role.level
          },
          JWT.SECRET,
          { expiresIn: JWT.ACCESS_TOKEN_EXPIRY }
        );
      }
}

module.exports = AuthService;