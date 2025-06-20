const moment = require('moment');
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = moment();

    await queryInterface.bulkInsert('mro_requests', [
      {
        grouping_problem: 'Elektrikal',
        location: 'Line 1',
        machine_name: 'AC90',
        machine_no: 'MCH001',
        carline: 'Carline A',
        notes: 'Perlu pengecekan wiring',
        date: now.format('YYYY-MM-DD'),
        status: 'sedang proses',
        PIC: 'Teknisi 1',
        waktu_mulai: now.format('YYYY-MM-DD HH:mm:ss'),
        waktu_selesai: null,
        time_off: null,
        repair: null,
        menunggu_qa: null,
        menunggu_part: null,
        total_waktu_perbaikan: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        grouping_problem: 'Mekanik',
        location: 'Line 2',
        machine_name: 'AC90',
        machine_no: 'MCH002',
        carline: 'Carline A',
        notes: 'Belt perlu diganti',
        date: now.format('YYYY-MM-DD'),
        status: 'belum ditangani',
        PIC: 'Teknisi 2',
        waktu_mulai: null,
        waktu_selesai: null,
        time_off: null,
        repair: null,
        menunggu_qa: null,
        menunggu_part: null,
        total_waktu_perbaikan: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mro_requests', null, {});
  }
};