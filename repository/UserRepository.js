// repository/UserRepository.js
var { QueryTypes } = require('sequelize');
const db = require('../config/connection'); // Koneksi database
const { Users } = require("../models/User"); // Pastikan ini mengarah ke model yang benar

const getAllUsers = async () => {
    try {
        const users = await db.query(
            'SELECT * FROM `users`',
            {
                type: QueryTypes.SELECT,
                model: Users,
                mapToModel: true,
            }
        );

        // Modify password display for each user
        const modifiedUsers = users.map(user => ({
            ...user,
            password: '*****'
        }));

        console.log('Users:', modifiedUsers);
        return modifiedUsers;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}
const createUser = async (userData) => {
    try {
        const result = await db.query(
            'INSERT INTO users (nik, name, email, password, level, kode, kodeColor, status, createdAt, updatedAt) VALUES (:nik, :name, :email, :password, :level, :kode, :kodeColor, :status, NOW(), NOW())',
            {
                replacements: userData,
                type: QueryTypes.INSERT
            }
        );
        return userData;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const updateUser = async (id, userData) => {
    try {
        const result = await db.query(
            'UPDATE users SET nik = ?, name = ?, email = ?, level = ?, status = ?, updatedAt = NOW() WHERE id = ?',
            {
                replacements: [
                    userData.nik,
                    userData.name,
                    userData.email,
                    userData.level,
                    userData.status,
                    id
                ],
                type: QueryTypes.UPDATE
            }
        );
        return { ...userData, id };
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};
const deleteUser = async (id) => {
    try {
        const result = await db.query(
            'DELETE FROM users WHERE id = :id',
            {
                replacements: { id },
                type: QueryTypes.DELETE
            }
        );
        return result;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

const bulkCreateUsers = async (users) => {
    try {
        const result = await db.query(
            'INSERT INTO users (nik, name, email, password, role_id, createdAt, updatedAt) VALUES ?',
            {
                replacements: [users.map(user => [
                    user.nik,
                    user.name,
                    user.email,
                    user.password,
                    user.role_id,
                    new Date(),
                    new Date()
                ])],
                type: QueryTypes.INSERT
            }
        );
        return users;
    } catch (error) {
        console.error('Error bulk creating users:', error);
        throw error;
    }
};
const searchUsers = async (searchTerm) => {
    try {
        // Handle case when searchTerm is a query parameter key
        const actualSearchTerm = searchTerm === undefined ? 
            Object.keys(searchTerm || {})[0] : searchTerm;

        const query = `
            SELECT * FROM users 
            WHERE 
                LOWER(nik) LIKE LOWER(?) OR
                LOWER(name) LIKE LOWER(?) OR
                LOWER(email) LIKE LOWER(?) OR
                LOWER(level) LIKE LOWER(?) OR
                LOWER(kode) LIKE LOWER(?) OR
                LOWER(kodeColor) LIKE LOWER(?) OR
                LOWER(status) LIKE LOWER(?)
        `;

        const searchValue = `%${actualSearchTerm}%`;
        const replacements = Array(7).fill(searchValue);

        const users = await db.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });

        return users.map(user => ({
            ...user,
            password: '*****'
        }));
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};
const filterUsers = async (status, level) => {
    try {
        let query = 'SELECT * FROM users WHERE 1=1';
        const replacements = [];

        if (status) {
            query += ' AND status = ?';
            replacements.push(status);
        }

        if (level) {
            query += ' AND level = ?';
            replacements.push(level.toUpperCase());
        }

        const users = await db.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });

        return users.map(user => ({
            ...user,
            password: '*****'
        }));
    } catch (error) {
        console.error('Error filtering users:', error);
        throw error;
    }
};
module.exports = {
    getAllUsers,
    createUser,
    bulkCreateUsers,
    updateUser,
    deleteUser,
    searchUsers,
    filterUsers
};
