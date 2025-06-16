// migrations/xxxx-create-mro-requests.js
module.exports = {
    async up(queryInterface, Sequelize) {
      await queryInterface.createTable('mro_requests', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        grouping_problem: {
          type: Sequelize.STRING,
          allowNull: false
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false
        },
        machine_name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        machine_no: {
          type: Sequelize.STRING,
          allowNull: false
        },
        carline: {
          type: Sequelize.STRING,
          allowNull: false
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        status: {
          type: Sequelize.ENUM('sedang proses', 'belum ditangani', 'terlambat', 'selesai', 'dibatalkan'),
          allowNull: false,
          defaultValue: 'sedang proses'
        },
        PIC : {
          type: Sequelize.STRING,
          allowNull: false
        },
        waktu_mulai: {
          type: Sequelize.DATE,
          allowNull: true
        },
        waktu_selesai: {
          type: Sequelize.DATE,
          allowNull: true
        },
        time_off: {
          type: Sequelize.DATE,
          allowNull: true
        },
        repair: {
          type: Sequelize.STRING,
          allowNull: true
        },
        menunggu_qa: {
          type: Sequelize.STRING,
          allowNull: true
        },
        menunggu_part: {
          type: Sequelize.STRING,
          allowNull: true
        },
        total_waktu_perbaikan: {
          type: Sequelize.DATE,
          allowNull: true
        },
        // Timestamps untuk created_at dan updated_at, jika ada pada d
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      });
    },
  
    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('mro_requests');
    }
  };
  