const db = require('../config/connection');
const { QueryTypes } = require('sequelize');

// Ambil daftar kerusakan
const getProblemGroups = async () => {
  return await db.query(
    'SELECT DISTINCT grouping_problem FROM problems',
    { type: QueryTypes.SELECT }
  );
};

// Ambil daftar lokasi mesin
const getProdNos = async () => {
  return await db.query(
    'SELECT DISTINCT location FROM machine',
    { type: QueryTypes.SELECT }
  );
};

// Ambil detail mesin berdasarkan lokasi
const getMachineDetailsByLocation = async (location) => {
  return await db.query(
    'SELECT machine_name, machine_number, carline FROM machines WHERE location = :location LIMIT 1',
    {
      replacements: { location },
      type: QueryTypes.SELECT
    }
  );
};

// Simpan form request
const getUserByNik = async (nik) => {
  return await db.query(
    `SELECT kode FROM users WHERE nik = :nik LIMIT 1`,
    {
      replacements: { nik },
      type: QueryTypes.SELECT
    }
  );
};

// Helper untuk generate tracking ID 8 digit
function generateTrackingId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Buat MRO Request
const createMroRequest = async (data) => {
  // Tambahkan tracking_id ke data
  const tracking_id = generateTrackingId();
  const dataWithTracking = { ...data, tracking_id };
  return await db.query(
    `INSERT INTO mro_requests 
     (grouping_problem, location, machine_name, machine_no, carline, notes, date, status, PIC, waktu_mulai, waktu_selesai, time_off, repair, menunggu_qa, menunggu_part, total_waktu_perbaikan, tracking_id)
     VALUES 
     (:grouping_problem, :location, :machine_name, :machine_no, :carline, :notes, :date, :status, :PIC, :waktu_mulai, :waktu_selesai, :time_off, :repair, :menunggu_qa, :menunggu_part, :total_waktu_perbaikan, :tracking_id)`,
    {
      replacements: dataWithTracking,
      type: QueryTypes.INSERT
    }
  );
};

// Ambil request berdasarkan ID
const getMroRequestById = async (id) => {
  return await db.query(
    `SELECT * FROM mro_requests WHERE id = :id`,
    {
      replacements: { id },
      type: QueryTypes.SELECT
    }
  );
};

const getpic = async () => {
  
}

// Accept MRO Request oleh teknisi dan langsung mulai mengerjakan
const acceptMroRequest = async (id, pic, waktuMulai) => {
  return await db.query(
    `UPDATE mro_requests 
     SET status = 'sedang proses', 
         PIC = :pic, 
         waktu_mulai = :waktuMulai,
         repair = 'sedang dikerjakan',
         menunggu_qa = 'menunggu',
         menunggu_part = 'menunggu',
         updated_at = NOW()
     WHERE id = :id`,
    {
      replacements: { id, pic, waktuMulai },
      type: QueryTypes.UPDATE,
    },
  )
}

// Complete MRO Request
const completeMroRequest = async (id, pic, waktuSelesai) => {
  return await db.query(
    `UPDATE mro_requests 
     SET status = 'selesai', 
         PIC = :pic, 
         waktu_selesai = :waktuSelesai,
         repair = 'selesai',
         updated_at = NOW()
     WHERE id = :id`,
    {
      replacements: {
        id,
        pic,
        waktuSelesai,
      },
      type: QueryTypes.UPDATE,
    }
  );
};
const getMroRequestSummary = async (period = 'day', year = null, month = null) => {
  let groupBy, dateFormat, where = '', replacements = {};
  if (period === 'day') {
    groupBy = 'DATE(date)';
    dateFormat = '%Y-%m-%d';
  } else if (period === 'week') {
    groupBy = 'YEAR(date), WEEK(date)';
    dateFormat = '%x-W%v';
  } else if (period === 'month') {
    groupBy = 'YEAR(date), MONTH(date)';
    dateFormat = '%Y-%m';
  } else if (period === 'year') {
    groupBy = 'YEAR(date)';
    dateFormat = '%Y';
  } else {
    groupBy = 'DATE(date)';
    dateFormat = '%Y-%m-%d';
  }
  if (year) {
    where += ' AND YEAR(date) = :year';
    replacements.year = year;
  }
  if (month) {
    where += ' AND MONTH(date) = :month';
    replacements.month = month;
  }
  const sql = `SELECT DATE_FORMAT(date, '${dateFormat}') as period, status, COUNT(*) as total
    FROM mro_requests
    WHERE 1=1 ${where}
    GROUP BY period, status
    ORDER BY period ASC`;
  return await db.query(sql, { replacements, type: QueryTypes.SELECT });
};

// Summary carline paling sering rusak
const getMostFrequentCarline = async (limit = 10, year = null, month = null) => {
  let where = '', replacements = {};
  if (year) {
    where += ' AND YEAR(date) = :year';
    replacements.year = year;
  }
  if (month) {
    where += ' AND MONTH(date) = :month';
    replacements.month = month;
  }
  const sql = `SELECT carline, COUNT(*) as total
    FROM mro_requests
    WHERE 1=1 AND carline IS NOT NULL AND carline != '' ${where}
    GROUP BY carline
    ORDER BY total DESC
    LIMIT :limit`;
  replacements.limit = limit;
  return await db.query(sql, { replacements, type: QueryTypes.SELECT });
};
module.exports = {
  getProblemGroups,
  getProdNos,
  getMachineDetailsByLocation,
  createMroRequest,
  getMroRequestById,
  getUserByNik,
  acceptMroRequest,
  completeMroRequest,
  getMroRequestSummary,
  getMostFrequentCarline,
};

// Summary agregasi MRO request per hari/minggu/bulan/tahun


