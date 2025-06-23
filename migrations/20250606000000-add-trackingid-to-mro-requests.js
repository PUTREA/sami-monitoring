module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('mro_requests', 'tracking_id', {
      type: Sequelize.STRING(8),
      allowNull: true,
      unique: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('mro_requests', 'tracking_id');
  }
};
