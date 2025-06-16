const mroRepo = require('../../repository/MroRepository');
const moment = require('moment');

const getFormOptions = async (req, res) => {
  try {
    const problems = await mroRepo.getProblemGroups();
    const prodNos = await mroRepo.getProdNos();
    res.json({ success: true, problems, prodNos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal ambil data form', error: error.message });
  }
};

const getMachineDetails = async (req, res) => {
  try {
    const { location } = req.params;
    const details = await mroRepo.getMachineDetailsByLocation(location);
    if (details.length === 0) {
      return res.status(404).json({ success: false, message: 'Data mesin tidak ditemukan' });
    }
    res.json({ success: true, data: details[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal ambil detail mesin', error: error.message });
  }
};




const createMroRequest = async (req, res) => {
  try {
    const { grouping_problem, location, machine_name, machine_no, carline, notes } = req.body;
    const nik = req.user.nik; // pastikan middleware auth menaruh nik di sini

    const user = await mroRepo.getUserByNik(nik);
    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan berdasarkan NIK' });
    }

    const kode = user[0].kode;
    const now = moment();

    const data = {
      grouping_problem,
      location,
      machine_name,
      machine_no,
      carline,
      notes,
      date: now.format('YYYY-MM-DD'),
      status: 'sedang proses',
      PIC: kode,
      waktu_mulai: now.format('HH:mm:ss'),
      waktu_selesai: 'menghitung',
      time_off: 0,
      repair: 'menunggu',
      menunggu_qa: 'menunggu',
      menunggu_part: 'menunggu',
      total_waktu_perbaikan: 0
    };

    const result = await mroRepo.createMroRequest(data);
    const insertId = result[0];

    const createdRequest = await mroRepo.getMroRequestById(insertId);

    res.status(201).json({ 
      success: true, 
      message: 'MRO Request berhasil dibuat', 
      data: createdRequest[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal buat MRO Request', error: error.message });
  }
};

module.exports = {
  createMroRequest
};




module.exports = {
  getFormOptions,
  getMachineDetails,
  createMroRequest
};
