module.exports = {
    // Role Hierarchy untuk authorization
    ROLES: {
        HIERARCHY: {
            teknisi: 1,
            "line leader": 2,
            supervisor: 3
        },
        // DEFAULT: 'user' // Role default saat registrasi
    },

    // Konfigurasi JWT
    JWT: {
        SECRET: process.env.JWT_SECRET || 'your_jwt_super_secret_key_here',
        ACCESS_TOKEN_EXPIRY: '1h',    // 1 jam
        REFRESH_TOKEN_EXPIRY: '7d',    // 7 hari
        TOKEN_TYPE: 'Bearer'
    },

    // Error res
    ERROR_MESSAGES: {
        AUTH: {
        INVALID_CREDENTIALS: 'Email atau password salah',
        UNAUTHORIZED: 'Anda tidak memiliki akses',
        TOKEN_EXPIRED: 'Token kedaluwarsa',
        TOKEN_INVALID: 'Token tidak valid',
        ROLE_FORBIDDEN: (requiredRoles) => 
            `Akses ditolak. Dibutuhkan role: ${requiredRoles.join(', ')}`
        },
        USER: {
        NOT_FOUND: 'User tidak ditemukan',
        EMAIL_EXISTS: 'Email sudah terdaftar'
        }
    },

    // Pagination Default
    PAGINATION: {
        // DEFAULT_PAGE: 1,
        // DEFAULT_LIMIT: 10
    }
}