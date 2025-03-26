// controllers/userController.js
const userRepository = require('../../repository/UserRepository');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers(); // Memanggil fungsi dari repository
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data pengguna ditemukan",
            });
        }
        res.status(200).json({
            success: true,
            message: "Data pengguna berhasil diambil",
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data pengguna",
            error: error.message,
        });
    }
};
