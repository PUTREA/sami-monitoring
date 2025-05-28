const sparepartRepository = require('../../repository/SparepartRepository');
const Excel = require('exceljs');
const PDFDocument = require('pdfkit');

const getAllSpareparts = async (req, res) => {
    try {
        const spareparts = await sparepartRepository.getAllSpareparts();
        if (!spareparts || spareparts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data sparepart ditemukan",
            });
        }
        res.status(200).json({
            success: true,
            message: "Data sparepart berhasil diambil",
            data: spareparts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data sparepart",
            error: error.message
        });
    }
};

const getSparepartById = async (req, res) => {
    try {
        const { id } = req.params;
        const sparepart = await sparepartRepository.getSparepartById(id);
        if (!sparepart) {
            return res.status(404).json({
                success: false,
                message: "Sparepart tidak ditemukan",
            });
        }
        res.status(200).json({
            success: true,
            message: "Data sparepart berhasil diambil",
            data: sparepart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data sparepart",
            error: error.message
        });
    }
};

const createSparepart = async (req, res) => {
    try {
        const sparepartData = req.body;
        // Validasi sederhana
        if (!sparepartData.location || !sparepartData.part_name || !sparepartData.part_number || !sparepartData.category || !sparepartData.machine_spec || !sparepartData.machine_name) {
            return res.status(400).json({
                success: false,
                message: "Data tidak lengkap"
            });
        }
        const result = await sparepartRepository.createSparepart(sparepartData);
        res.status(201).json({
            success: true,
            message: "Sparepart berhasil ditambahkan",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menambah sparepart",
            error: error.message
        });
    }
};

const updateSparepart = async (req, res) => {
    try {
        const { id } = req.params;
        const sparepartData = req.body;
        const updated = await sparepartRepository.updateSparepart(id, sparepartData);
        res.status(200).json({
            success: true,
            message: "Sparepart berhasil diperbarui",
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memperbarui sparepart",
            error: error.message
        });
    }
};

const deleteSparepart = async (req, res) => {
    try {
        const { id } = req.params;
        await sparepartRepository.deleteSparepart(id);
        res.status(200).json({
            success: true,
            message: "Sparepart berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus sparepart",
            error: error.message
        });
    }
};

const importSparepartsFromExcel = async (req, res) => {
    try {
        console.log('Files received:', req.files);
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "File tidak ditemukan" });
        }

        const file = req.files.file;
        console.log('File details:', file);
        
        // Validasi tipe file
        if (!file.name.match(/\.(xlsx|xls)$/)) {
            return res.status(400).json({
                success: false,
                message: "Harap unggah file Excel yang valid (xlsx atau xls)"
            });
        }
        
        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(file.data);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            console.error("Worksheet tidak ditemukan");
            return res.status(400).json({ success: false, message: "Worksheet tidak ditemukan" });
        }

        console.log("Worksheet name:", worksheet.name);
        console.log("Total rows:", worksheet.rowCount);
        const spareparts = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header

            const sparepart = {
                location: row.getCell(2).value,
                part_name: row.getCell(3).value,
                part_number: row.getCell(4).value,
                part_sami_number: row.getCell(5).value,
                category: row.getCell(6).value,
                machine_spec: row.getCell(7).value,
                machine_name: row.getCell(8).value,
            };

            console.log(`Row ${rowNumber} ➜`, sparepart);
            spareparts.push(sparepart);
        });

        console.log("Total sparepart terdeteksi:", spareparts.length);

        if (spareparts.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nama part dan nomor part harus diisi"
            });
        }

        await sparepartRepository.bulkCreateSpareparts(spareparts);

        res.status(200).json({
            success: true,
            message: `Berhasil mengimpor ${spareparts.length} sparepart`,
            data: spareparts
        });
    } catch (err) {
        console.error("Import error:", err);
        res.status(500).json({ success: false, message: "Gagal mengimpor", error: err.message });
    }
};

const exportSparepartsToExcel = async (req, res) => {
    try {
        const spareparts = await sparepartRepository.getAllSpareparts();
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Spareparts');
        worksheet.addRow(["location", "part_name", "part_number", "part_sami_number", "category", "machine_spec", "machine_name"]);
        spareparts.forEach(sparepart => {
            worksheet.addRow([
                sparepart.location,
                sparepart.part_name,
                sparepart.part_number,
                sparepart.part_sami_number,
                sparepart.category,
                sparepart.machine_spec,
                sparepart.machine_name
            ]);
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=spareparts.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat export Excel", error: error.message });
    }
};
const exportSparepartsToPDF = async (req, res) => {
    try {
        const spareparts = await sparepartRepository.getAllSpareparts();
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=spareparts.pdf');
            res.end(pdfData);
        });
        doc.fontSize(16).text('Data Spareparts', { align: 'center' });
        doc.moveDown();
        const tableTop = 80;
        const itemHeight = 20;
        const headers = ["Location", "Part Name", "Part Number", "Part SAMI Number", "Category", "Machine Spec", "Machine Name"];
        let y = tableTop;
        doc.fontSize(10);
        headers.forEach((header, i) => {
            doc.text(header, 30 + i * 80, y, { width: 80, align: 'left' });
        });
        y += itemHeight;
        spareparts.forEach(sparepart => {
            [sparepart.location, sparepart.part_name, sparepart.part_number, sparepart.part_sami_number, sparepart.category, sparepart.machine_spec, sparepart.machine_name].forEach((val, i) => {
                doc.text(val ? val.toString() : '', 30 + i * 80, y, { width: 80, align: 'left' });
            });
            y += itemHeight;
            if (y > 750) {
                doc.addPage();
                y = tableTop;
            }
        });
        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat export PDF", error: error.message });
    }
};

const searchSpareparts = async (req, res) => {
    const searchTerm = req.query.q || 
    (Object.keys(req.query).length > 0 ? Object.keys(req.query)[0] : '');
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            message: "Parameter pencarian (q) diperlukan"
        });
    }
    try {
        const results = await sparepartRepository.searchSpareparts(searchTerm);
        res.json({
            success: true,
            message: "Pencarian sparepart berhasil",
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mencari sparepart",
            error: error.message
        });
    }
};

const filterSpareparts = async (req, res) => {
    try {
        const filters = req.query;
        
        const spareparts = await sparepartRepository.filterSpareparts(filters);
        
        if (spareparts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada sparepart yang sesuai dengan filter",
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Filter sparepart berhasil",
            data: spareparts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memfilter sparepart",
            error: error.message
        });
    }
};

module.exports = {
    getAllSpareparts,
    getSparepartById,
    createSparepart,
    updateSparepart,
    deleteSparepart,
    importSparepartsFromExcel,
    exportSparepartsToExcel,
    exportSparepartsToPDF,
    searchSpareparts,
    filterSpareparts
};