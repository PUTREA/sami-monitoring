'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Machines', [
      {
        machine_number: 'MCH001',
        machine_name: 'AC90',
        location: 'Line 1',
        carline: 'Carline A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        machine_number: 'MCH002',
        machine_name: 'AC90',
        location: 'Line 2',
        carline: 'Carline A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        machine_number: 'MCH003',
        machine_name: 'AC90',
        location: 'Line 3',
        carline: 'Carline B',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        machine_number: 'MCH004',
        machine_name: 'AC90',
        location: 'QC Area',
        carline: 'Carline C',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        machine_number: 'MCH005',
        machine_name: 'AC90',
        location: 'Warehouse',
        carline: 'Carline D',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Machines', null, {});
  }
};