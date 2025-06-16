const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/connection'); // Sequelize instance
const { QueryTypes } = require('sequelize');
const { JWT } = require('../utils/utils');

class AuthService {
  static async login(email, password) {
    if (!email || !password) {
      throw new Error('Email dan password wajib diisi');
    }

    // Query langsung dari tabel users
    const users = await db.query(
      `
      SELECT id, nik, email, password, level
      FROM users
      WHERE email = :email
      `,
      {
        replacements: { email },
        type: QueryTypes.SELECT,
      }
    );

    if (!users || users.length === 0) {
      throw new Error('Email atau password salah');
    }

    const user = users[0];

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Email atau password salah');
    }

    // Validasi role
    const validRoles = ['teknisi', 'line leader', 'supervisor'];
    if (!validRoles.includes(user.level.toLowerCase())) {
      throw new Error('Role user tidak valid');
    }

    // Berhasil login
    return {
      token: this.generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        role: user.level.toLowerCase()
      }
    };
  }

  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.level,
        nik: user.nik
      },
      JWT.SECRET,
      { expiresIn: JWT.ACCESS_TOKEN_EXPIRY }
    );
  }
}

module.exports = AuthService;
