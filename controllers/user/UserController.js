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
        doc.text('Role', colPositions.role, doc.y - doc.currentLineHeight(), { width: roleColumnWidth, align: 'center' });
        
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
        const { nik, name, email, password, role_id } = req.body;

        // Validate required fields
        if (!nik || !name || !email || !password || !role_id) {
            return res.status(400).json({
                success: false,
                message: "Semua field harus diisi"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user data object
        const userData = {
            nik,
            name,
            email,
            password: hashedPassword,
            role_id
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
                role_id: newUser.role_id
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
    importUsersFromExcel
};