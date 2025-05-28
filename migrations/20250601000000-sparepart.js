module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('spareparts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      part_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      part_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      part_sami_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      machine_spec: {
        type: Sequelize.STRING,
        allowNull: false
      },
      machine_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('spareparts');
  }
};