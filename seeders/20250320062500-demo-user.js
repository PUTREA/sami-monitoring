'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        nik: "000046",
        name: "Supervisor",
        email: "supervisor@example.com",
        password: await bcrypt.hash("password123", 10), // Hash password
        status: "Aktif",
        kode: "spv-1",
        kodeColor: "blue",
        level: "SUPERVISOR",
        // role_id: 1, // ID role admin
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nik: "J00046",
        name: "Line leader",
        email: "lineleader@example.com",
        password: await bcrypt.hash("password123", 10), // Hash password
        status: "Aktif",
        kode: "leadline-1",
        kodeColor: "red",
        level: "LINE LEADER",
        // role_id: 2, // ID role user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nik: "J10046",
        name: "Teknisi",
        email: "teknisi@example.com",
        password: await bcrypt.hash("password123", 10), // Hash password
        status: "Aktif",
        kode: "tkns-1",
        kodeColor: "yellow",
        level: "TEKNISI",
        // role_id: 3, // ID role user
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
