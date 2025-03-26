'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("roles", [
      {
        level: "SUPERVISOR",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        level: "LINE LEADER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        level: "TEKNISI",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("roles", null, {});
  }
};
