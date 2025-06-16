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

// Buat MRO Request
const createMroRequest = async (data) => {
  return await db.query(
    `INSERT INTO mro_requests 
     (grouping_problem, location, machine_name, machine_no, carline, notes, date, status, PIC, waktu_mulai, waktu_selesai, time_off, repair, menunggu_qa, menunggu_part, total_waktu_perbaikan)
     VALUES 
     (:grouping_problem, :location, :machine_name, :machine_no, :carline, :notes, :date, :status, :PIC, :waktu_mulai, :waktu_selesai, :time_off, :repair, :menunggu_qa, :menunggu_part, :total_waktu_perbaikan)`,
    {
      replacements: data,
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
  
module.exports = {
  getProblemGroups,
  getProdNos,
  getMachineDetailsByLocation,
  createMroRequest,
  getMroRequestById,
  getUserByNik
};
