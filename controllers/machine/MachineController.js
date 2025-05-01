// controllers/machine/MachineController.js
const machineRepository = require('../../repository/MachineRepository');
const Excel = require('exceljs');
const PDFDocument = require('pdfkit');

const getAllMachines = async (req, res) => {
    try {
        const machines = await machineRepository.getAllMachines(); // Memanggil fungsi dari repository
        if (machines.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data mesin ditemukan",
            });
        }
        res.status(200).json({
            success: true,
            message: "Data mesin berhasil diambil",
            data: machines,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data mesin",
            error: error.message
        });
    }
};

const getMachineById = async (req, res) => {
    try {
        const { id } = req.params;
        const machine = await machineRepository.getMachineById(id);
        
        if (!machine) {
            return res.status(404).json({
                success: false,
                message: "Mesin tidak ditemukan",
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Data mesin berhasil diambil",
            data: machine,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data mesin",
            error: error.message
        });
    }
};

const createMachine = async (req, res) => {
    try {
        const machineData = req.body;
        
        // Validasi data
        if (!machineData.machine_number || !machineData.machine_name) {
            return res.status(400).json({
                success: false,
                message: "Nomor mesin dan nama mesin harus diisi",
            });
        }
        
        const newMachine = await machineRepository.createMachine(machineData);
        
        res.status(201).json({
            success: true,
            message: "Mesin berhasil ditambahkan",
            data: newMachine,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menambahkan mesin",
            error: error.message
        });
    }
};

const updateMachine = async (req, res) => {
    try {
        const { id } = req.params;
        const machineData = req.body;
        
        // Validasi data
        if (!machineData.machine_number || !machineData.machine_name) {
            return res.status(400).json({
                success: false,
                message: "Nomor mesin dan nama mesin harus diisi",
            });
        }
        
        // Cek apakah mesin ada
        const existingMachine = await machineRepository.getMachineById(id);
        if (!existingMachine) {
            return res.status(404).json({
                success: false,
                message: "Mesin tidak ditemukan",
            });
        }
        
        const updatedMachine = await machineRepository.updateMachine(id, machineData);
        
        res.status(200).json({
            success: true,
            message: "Data mesin berhasil diperbarui",
            data: { id, ...machineData },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memperbarui data mesin",
            error: error.message
        });
    }
};

const deleteMachine = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Cek apakah mesin ada
        const existingMachine = await machineRepository.getMachineById(id);
        if (!existingMachine) {
            return res.status(404).json({
                success: false,
                message: "Mesin tidak ditemukan",
            });
        }
        
        await machineRepository.deleteMachine(id);
        
        res.status(200).json({
            success: true,
            message: "Mesin berhasil dihapus",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus mesin",
            error: error.message
        });
    }
};

const searchMachines = async (req, res) => {
    const searchTerm = req.query.q|| 
    (Object.keys(req.query).length > 0 ? Object.keys(req.query)[0] : '');;
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            message: "Parameter pencarian (q) diperlukan"
        });
    }
    try {
        const results = await machineRepository.searchMachines(searchTerm);
        res.json({
            success: true,
            message: "Pencarian mesin berhasil",
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mencari mesin",
            error: error.message
        });
    }
};

const filterMachines = async (req, res) => {
    try {
        const filters = req.query;
        
        const machines = await machineRepository.filterMachines(filters);
        
        if (machines.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada mesin yang sesuai dengan filter",
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Filter mesin berhasil",
            data: machines,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memfilter mesin",
            error: error.message
        });
    }
};

const exportMachinesToExcel = async (req, res) => {
    try {
        const machines = await machineRepository.getAllMachines();

        if (!machines || machines.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data mesin untuk di-export"
            });
        }

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Machines');

        worksheet.columns = [
            { header: 'No', key: 'no', width: 10 },
            { header: 'Nomor Mesin', key: 'machine_number', width: 15 },
            { header: 'Nama Mesin', key: 'machine_name', width: 20 },
            { header: 'Lokasi', key: 'location', width: 20 },
            { header: 'Carline', key: 'carline', width: 20 }
        ];

        // Add rows
        machines.forEach((machine, index) => {
            worksheet.addRow({
                no: index + 1, // Nomor urut dimulai dari 1
                machine_number: machine.machine_number,
                machine_name: machine.machine_name,
                location: machine.location || '-',
                carline: machine.carline || '-'
            });
        });

        // Style header row
        worksheet.getRow(1).font = { bold: true };

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=machines.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error exporting machines to Excel:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengexport data mesin ke Excel",
            error: error.message
        });
    }
};

const exportMachinesToPDF = async (req, res) => {
    try {
        const machines = await machineRepository.getAllMachines();

        if (!machines || machines.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data mesin untuk di-export"
            });
        }

        const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=machines.pdf');

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add title
        doc.fontSize(16).text('Daftar Mesin', { align: 'center' });
        doc.moveDown();

        // Define table layout
        const tableTop = 100;
        const colWidths = [60, 100, 80, 70, 80, 80, 80, 80];
        let rowTop = tableTop;

        // Add table headers
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('No', 30, rowTop);
        doc.text('Nomor Mesin', 80, rowTop);
        doc.text('Nama Mesin', 200, rowTop);
        doc.text('Lokasi', 350, rowTop);
        doc.text('Carline', 500, rowTop);

        rowTop += 20;

        // Add table rows
        doc.font('Helvetica');
        machines.forEach((machine, index) => {
            // Check if we need a new page
            if (rowTop > 700) {
                doc.addPage();
                rowTop = tableTop;
                
                // Add headers to new page
                doc.fontSize(10).font('Helvetica-Bold');
                doc.text('No', 30, rowTop);
                doc.text('Nomor Mesin', 80, rowTop);
                doc.text('Nama Mesin', 200, rowTop);
                doc.text('Lokasi', 350, rowTop);
                doc.text('Carline', 500, rowTop);
                
                rowTop += 20;
                doc.font('Helvetica');
            }
            
            doc.text((index + 1).toString(), 30, rowTop);
            doc.text(machine.machine_number, 80, rowTop);
            doc.text(machine.machine_name, 200, rowTop);
            doc.text(machine.location || '-', 350, rowTop);
            doc.text(machine.carline || '-', 500, rowTop);
            
            rowTop += 20;
        });

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error('Error exporting machines to PDF:', error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengexport data mesin ke PDF",
            error: error.message
        });
    }
};

// const importMachinesFromExcel = async (req, res) => {
//     try {
//         console.log('Files received:', req.files); // Debug log

//         if (!req.files || Object.keys(req.files).length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "No files were uploaded"
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: "File berhasil diunggah"
//             // message: `Successfully imported ${savedUsers.length} users`,
//             // data: savedUsers
//         });
//     } catch (error) {
//         console.error('Error importing machines from Excel:', error);
//         res.status(500).json({
//             success: false,
//             message: "Terjadi kesalahan saat mengimpor data mesin dari Excel",
//             error: error.message
//         });
//     }
// }

const importMachinesFromExcel = async (req, res) => {
    try {
        console.log('Files received:', req.files); // Debug log
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "File tidak ditemukan" });
        }

        const file = req.files.file;
        console.log('File details:', file);
        
        // Validate file type
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            return res.status(400).json({
                success: false,
                message: "Please upload a valid Excel file (xlsx or xls)"
            });
        }
        
        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(file.data);

        const worksheet = workbook.getWorksheet(1); // Lebih aman daripada getWorksheet(1)
        if (!worksheet) {
            console.error("Worksheet tidak ditemukan");
            return res.status(400).json({ success: false, message: "Worksheet tidak ditemukan" });
        }

        console.log("Worksheet name:", worksheet.name);
        console.log("Total rows:", worksheet.rowCount);
        const machines = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const machine = {
                machine_name: row.getCell(2).value,
                machine_number: row.getCell(3).value,
                location: row.getCell(4).value,
                carline: row.getCell(5).value,
            };

            console.log(`Row ${rowNumber} ➜`, machine); // Log isi row

            machines.push(machine);
        });

        console.log("🧾 Total mesin terdeteksi:", machines.length);

        if (machines.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nomor mesin dan nama mesin harus diisi"
            });
        }

        await machineRepository.bulkCreateMachine(machines);

        res.status(200).json({
            success: true,
            message: `Berhasil mengimpor ${machines.length} mesin`,
            data: machines
        });
    } catch (err) {
        console.error("❌ Import error:", err);
        res.status(500).json({ success: false, message: "Gagal mengimpor", error: err.message });
    }
};

module.exports = {
    getAllMachines,
    getMachineById,
    createMachine,
    updateMachine,
    deleteMachine,
    searchMachines,
    filterMachines,
    exportMachinesToExcel,
    exportMachinesToPDF,
    importMachinesFromExcel
};