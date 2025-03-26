// repository/UserRepository.js
var { QueryTypes } = require('sequelize');
const db = require('../config/connection'); // Koneksi database
const { Users } = require("../models/User"); // Pastikan ini mengarah ke model yang benar

const getAllUsers = async () => {
    try {
        // Mengambil semua data pengguna dari tabel users
        const users = await db.query(
            'SELECT * FROM `users`',
            {
                type: QueryTypes.SELECT, // Menggunakan QueryTypes.SELECT untuk mengambil data
                model: Users, // Mengaitkan dengan model Users
                mapToModel: true, // Memetakan hasil ke model
            }
        );

        console.log('Users:', users); // Menampilkan data pengguna di konsol
        return users; // Mengembalikan data pengguna
    } catch (error) {
        console.error('Error fetching users:', error); // Menampilkan error di konsol
        throw error; // Melemparkan error untuk ditangani di tempat lain
    }
}

module.exports = {
    getAllUsers
};
