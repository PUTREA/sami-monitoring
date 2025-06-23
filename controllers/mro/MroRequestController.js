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
      status: 'belum ditangani',
      PIC: kode,
      waktu_mulai: now.format('YYYY-MM-DD HH:mm:ss'),
      waktu_selesai: null,
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

const acceptMroRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const nik = req.user.nik;

    if (req.user.role !== "teknisi") {
      return res.status(403).json({
        success: false,
        message: "Hanya teknisi yang dapat menerima MRO request",
      });
    }

    const existingRequest = await mroRepo.getMroRequestById(id);
    if (!existingRequest || existingRequest.length === 0) {
      return res.status(404).json({
        success: false,
        message: "MRO request tidak ditemukan",
      });
    }

    const request = existingRequest[0];

    if (request.status !== "belum ditangani") {
      return res.status(400).json({
        success: false,
        message: "MRO request sudah ditangani atau tidak dapat diterima",
      });
    }

    const user = await mroRepo.getUserByNik(nik);
    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data teknisi tidak ditemukan",
      });
    }

    const kode = user[0].kode;

    // KEMBALI ke UTC untuk konsistensi dengan database
    const now = moment.utc();
    const waktuMulai = now.format('YYYY-MM-DD HH:mm:ss');

    await mroRepo.acceptMroRequest(id, kode, waktuMulai);

    const updatedRequest = await mroRepo.getMroRequestById(id);

    res.status(200).json({
      success: true,
      message: "MRO request berhasil diterima dan pekerjaan dimulai",
      data: {
        ...updatedRequest[0],
        waktu_mulai: waktuMulai,
      },
    });
  } catch (error) {
    console.error("Accept MRO request error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menerima MRO request",
      error: error.message,
    });
  }
};

const completeMroRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const nik = req.user.nik;

    if (req.user.role !== "teknisi") {
      return res.status(403).json({
        success: false,
        message: "Hanya teknisi yang dapat menyelesaikan MRO request",
      });
    }

    const existingRequest = await mroRepo.getMroRequestById(id);
    if (!existingRequest || existingRequest.length === 0) {
      return res.status(404).json({
        success: false,
        message: "MRO request tidak ditemukan",
      });
    }

    const request = existingRequest[0];

    if (request.status !== "sedang proses") {
      return res.status(400).json({
        success: false,
        message: "MRO request belum diterima atau sudah selesai",
      });
    }

    const user = await mroRepo.getUserByNik(nik);
    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data teknisi tidak ditemukan",
      });
    }

    const kode = user[0].kode;

    // Gunakan UTC untuk konsistensi dengan database
    const now = moment.utc();
    const waktuSelesai = now.format('YYYY-MM-DD HH:mm:ss');

    // Parse waktu_mulai sebagai UTC (karena dari database dalam format UTC)
    const waktuMulai = request.waktu_mulai ? moment.utc(request.waktu_mulai) : null;

    let totalWaktuPerbaikan = "00:00:00";
    let totalDetikPerbaikan = 0;

    if (waktuMulai && waktuMulai.isValid() && now.isAfter(waktuMulai)) {
      const duration = moment.duration(now.diff(waktuMulai));
      
      // Hitung total jam, menit, dan detik dengan benar
      const totalSeconds = Math.floor(duration.asSeconds());
      
      if (totalSeconds > 0) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Format dengan padding zero
        totalWaktuPerbaikan = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        totalDetikPerbaikan = totalSeconds;
        
      }
    }

    // Simpan waktu selesai ke DB
    await mroRepo.completeMroRequest(id, kode, waktuSelesai);

    // Ambil data terbaru dari database
    const updatedRequest = await mroRepo.getMroRequestById(id);

    res.status(200).json({
      success: true,
      message: "MRO request berhasil diselesaikan",
      data: {
        ...updatedRequest[0],
        waktu_selesai: waktuSelesai,
        total_waktu_perbaikan: totalWaktuPerbaikan,
        total_detik_perbaikan: totalDetikPerbaikan,
      },
    });
  } catch (error) {
    console.error("Complete MRO request error:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menyelesaikan MRO request",
      error: error.message,
    });
  }
};

const getMroRequestSummary = async (req, res) => {
  try {
    const { period = 'day', year, month } = req.query;
    const data = await mroRepo.getMroRequestSummary(period, year, month);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil summary MRO request', error: error.message });
  }
};
const getMostFrequentCarline = async (req, res) => {
  try {
    const { limit = 10, year, month } = req.query;
    const data = await mroRepo.getMostFrequentCarline(Number(limit), year, month);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data carline paling sering rusak', error: error.message });
  }
};
module.exports = {
  getFormOptions,
  getMachineDetails,
  createMroRequest,
  acceptMroRequest,
  completeMroRequest,
  getMroRequestSummary,
  getMostFrequentCarline,
};
