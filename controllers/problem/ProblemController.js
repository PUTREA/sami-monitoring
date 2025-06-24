const problemRepository = require('../../repository/ProblemRepository');
const PDFDocument = require('pdfkit');

const getAllProblems = async (req, res) => {
    try {
        const problems = await problemRepository.getAllProblems();
        if (!problems || problems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data problem ditemukan",
            });
        }
        res.status(200).json({
            success: true,
            message: "Data problem berhasil diambil",
            data: problems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data problem",
            error: error.message
        });
    }
};

const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await problemRepository.getProblemById(id);
        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem tidak ditemukan",
            });
        }
        res.status(200).json({
            success: true,
            message: "Problem berhasil diambil",
            data: problem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data problem",
            error: error.message
        });
    }
};

const createProblem = async (req, res) => {
    try {
        const problemData = req.body;
        const result = await problemRepository.createProblem(problemData);

        res.status(201).json({
            success: true,
            message: "Problem berhasil dibuat",
            data: {
                id: result[0], // ambil insertId
                no: problemData.no,
                problem: problemData.problem
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat membuat problem",
            error: error.message
        });
    }
};


const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const problemData = req.body;
        const result = await problemRepository.updateProblem(id, problemData);
        res.status(200).json({
            success: true,
            message: "Problem berhasil diupdate",
            data: {
                id: result[0], 
                no: problemData.no,
                problem: problemData.problem
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengupdate problem",
            error: error.message
        });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await problemRepository.deleteProblem(id);
        res.status(200).json({
            success: true,
            message: "Problem berhasil dihapus",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus problem",
            error: error.message
        });
    }
};

const exportProblemsToPDF = async (req, res) => {
    try {
        const problems = await problemRepository.getAllProblems();
        if (!problems || problems.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tidak ada data problem untuk di-export"
            });
        }

        const doc = new PDFDocument();
        doc.pipe(res);

        doc.fontSize(12).text('Problem Report', { align: 'center' });
        doc.moveDown();

        problems.forEach((problem, index) => {
            doc.text(`No: ${problem.no}`);
            doc.text(`Problem: ${problem.problem}`);
            doc.moveDown();
        });

        doc.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengekspor data problem",
            error: error.message
        });
    }
};

module.exports = {
    getAllProblems,
    getProblemById,
    createProblem,
    updateProblem,
    deleteProblem,
    exportProblemsToPDF
};