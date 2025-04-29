// controllers/userController.js
const userRepository = require('../../repository/UserRepository');
const Excel = require('exceljs');
const PDFDocument = require('pdfkit');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
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
            error: error.message
        });
    }
};
const exportUsersToExcel = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        console.log('Retrieved users:', users);

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data pengguna untuk di-export"
            });
        }

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Users');

        worksheet.columns = [
            { header: 'NIK', key: 'nik', width: 15 },
            { header: 'Nama', key: 'name', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Role', key: 'role_id', width: 15 }
        ];

        const formattedUsers = users.map(user => ({
            nik: user.nik || '',
            name: user.name || '',
            email: user.email || '',
            role_id: user.role_id || ''
        }));

        worksheet.addRows(formattedUsers);

        // Generate buffer instead of writing directly to response
        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        
        // Send buffer
        res.send(buffer);

    } catch (error) {
        console.error('Export error details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export users data',
            error: error.message
        });
    }
};
const exportUsersToPDF = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data pengguna untuk di-export"
            });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
        doc.pipe(res);

        // Title
        doc.fontSize(16).text('Data Pengguna', { align: 'center' });
        doc.moveDown();

        // Define column positions and widths
        const colPositions = {
            nik: 50,
            name: 150,
            email: 300,
            role: 450
        };
        
        const roleColumnWidth = 50; // Width for role column

        // Add headers with specific positions
        doc.fontSize(12);
        doc.text('NIK', colPositions.nik, doc.y);
        doc.text('Nama', colPositions.name, doc.y - doc.currentLineHeight());
        doc.text('Email', colPositions.email, doc.y - doc.currentLineHeight());
        doc.text('Role id', colPositions.role, doc.y - doc.currentLineHeight(), { width: roleColumnWidth, align: 'center' });
        
        doc.moveDown();

        // Add separator line
        doc.moveTo(50, doc.y)
           .lineTo(550, doc.y)
           .stroke();
        doc.moveDown();

        // Add user data with specific positions
        users.forEach(user => {
            const y = doc.y;
            doc.text(user.nik || '-', colPositions.nik, y);
            doc.text(user.name || '-', colPositions.name, y);
            doc.text(user.email || '-', colPositions.email, y);
            doc.text(user.role_id?.toString() || '-', colPositions.role, y, { width: roleColumnWidth, align: 'center' });
            doc.moveDown();
        });

        doc.end();

    } catch (error) {
        console.error('Export PDF error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export users data to PDF',
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { nik, name, email, password, level } = req.body;

        // Validate required fields
        if (!nik || !name || !email || !password || !level) {
            return res.status(400).json({
                success: false,
                message: "Semua field harus diisi"
            });
        }

        // Validate level
        const validLevels = ['SUPERVISOR', 'LINE LEADER', 'TEKNISI'];
        if (!validLevels.includes(level.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: "Level harus SUPERVISOR, LINE LEADER, atau TEKNISI"
            });
        }

        // Generate kode from name (first letter of each word)
        const kode = name.split(' ')
            .map(word => word.substring(0, 1))
            .join('')
            .toUpperCase();

        // Determine kodeColor based on level
        let kodeColor;
        switch(level.toUpperCase()) {
            case 'SUPERVISOR':
                kodeColor = 'yellow';
                break;
            case 'LINE LEADER':
                kodeColor = 'red';
                break;
            case 'TEKNISI':
                kodeColor = 'blue';
                break;
        }

        // Create user data object
        const userData = {
            nik,
            name,
            email,
            password: await bcrypt.hash(password, 10),
            level: level.toUpperCase(),
            kode,
            kodeColor,
            status: 'Non-Aktif'
        };

        // Save user to database
        const newUser = await userRepository.createUser(userData);

        res.status(201).json({
            success: true,
            message: "User berhasil ditambahkan",
            data: {
                nik: newUser.nik,
                name: newUser.name,
                email: newUser.email,
                level: newUser.level,
                kode: newUser.kode,
                kodeColor: newUser.kodeColor,
                status: newUser.status
            }
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan user',
            error: error.message
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nik, name, email, level, status } = req.body;

        // Validate required fields
        if (!nik || !name || !email || !level || !status) {
            return res.status(400).json({
                success: false,
                message: "Semua field harus diisi"
            });
        }

        // Validate level
        const validLevels = ['SUPERVISOR', 'LINE LEADER', 'TEKNISI'];
        if (!validLevels.includes(level.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: "Level harus SUPERVISOR, LINE LEADER, atau TEKNISI"
            });
        }

        // Validate status
        if (!['Aktif', 'Non-Aktif'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status harus Aktif atau Non-Aktif"
            });
        }

        // Generate new kode if name changed
        const kode = name.split(' ')
            .map(word => word.substring(0, 1))
            .join('')
            .toUpperCase();

        // Determine kodeColor based on level
        let kodeColor;
        switch(level.toUpperCase()) {
            case 'SUPERVISOR':
                kodeColor = 'yellow';
                break;
            case 'LINE LEADER':
                kodeColor = 'red';
                break;
            case 'TEKNISI':
                kodeColor = 'blue';
                break;
        }

        const userData = {
            nik,
            name,
            email,
            level: level.toUpperCase(),
            kode,
            kodeColor,
            status
        };

        const updatedUser = await userRepository.updateUser(id, userData);

        res.status(200).json({
            success: true,
            message: "User berhasil diupdate",
            data: updatedUser
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate user',
            error: error.message
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userRepository.deleteUser(id);

        res.status(200).json({
            success: true,
            message: "User berhasil dihapus"
        });

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus user',
            error: error.message
        });
    }
};

const searchUsers = async (req, res) => {
    try {
        // Get search term from query parameters
        const searchTerm = req.query.q || 
            (Object.keys(req.query).length > 0 ? Object.keys(req.query)[0] : '');

        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: "Masukkan kata kunci pencarian"
            });
        }

        const users = await userRepository.searchUsers(searchTerm);

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data pengguna yang sesuai dengan kriteria pencarian"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data pengguna berhasil ditemukan",
            data: users
        });

    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mencari data pengguna',
            error: error.message
        });
    }
};
const filterAndSortUsers = async (req, res) => {
    try {
        const { status, sort, level } = req.query;
        
        // Define level hierarchy weights
        const levelWeight = {
            'SUPERVISOR': 1,
            'LINE LEADER': 2,
            'TEKNISI': 3
        };

        let users = await userRepository.filterUsers(status, level);

        // Sort users based on level hierarchy and/or specified order
        if (users.length > 0) {
            users.sort((a, b) => {
                // First sort by level hierarchy
                const levelDiff = levelWeight[a.level] - levelWeight[b.level];
                
                // If levels are different, use level hierarchy
                if (levelDiff !== 0) {
                    return sort === 'desc' ? -levelDiff : levelDiff;
                }
                
                // If levels are same, sort by name
                return sort === 'desc' ? 
                    b.name.localeCompare(a.name) : 
                    a.name.localeCompare(b.name);
            });
        }

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data pengguna yang sesuai dengan filter"
            });
        }

        res.status(200).json({
            success: true,
            message: "Data pengguna berhasil difilter",
            data: users
        });

    } catch (error) {
        console.error('Filter users error:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memfilter data pengguna',
            error: error.message
        });
    }
};
const importUsersFromExcel = async (req, res) => {
    try {
        console.log('Files received:', req.files); // Debug log

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files were uploaded"
            });
        }

        const file = req.files.file;
        console.log('File details:', file); // Debug log

        // Validate file type
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            return res.status(400).json({
                success: false,
                message: "Please upload a valid Excel file (xlsx or xls)"
            });
        }

        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(file.data);
        
        // Rest of your existing code...
        const worksheet = workbook.getWorksheet(1);
        const users = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                const user = {
                    nik: row.getCell(1).value,
                    name: row.getCell(2).value,
                    email: row.getCell(3).value,
                    password: bcrypt.hashSync('default123', 10), // Default password
                    role_id: row.getCell(4).value
                };
                users.push(user);
            }
        });

        // Save users to database
        const savedUsers = await userRepository.bulkCreateUsers(users);

        res.status(200).json({
            success: true,
            message: `Successfully imported ${savedUsers.length} users`,
            data: savedUsers
        });

    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to import users',
            error: error.message
        });
    }
};
module.exports = {
    getAllUsers,
    exportUsersToExcel,
    exportUsersToPDF,
    createUser,
    importUsersFromExcel,
    updateUser,
    deleteUser,
    searchUsers,
    filterAndSortUsers
};