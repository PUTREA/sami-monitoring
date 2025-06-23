'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('problems', [
      { no: 1, problem: 'Mesin tidak mau start', createdAt: new Date(), updatedAt: new Date() },
      { no: 2, problem: 'Sensor tidak terdeteksi', createdAt: new Date(), updatedAt: new Date() },
      { no: 3, problem: 'Motor panas berlebih', createdAt: new Date(), updatedAt: new Date() },
      { no: 4, problem: 'Belt putus', createdAt: new Date(), updatedAt: new Date() },
      { no: 5, problem: 'Panel error', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('problems', null, {});
  }
};