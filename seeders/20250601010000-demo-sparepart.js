"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("spareparts", [
      {
        location: "Gudang A",
        part_name: "Bearing 6203",
        part_number: "BRG-6203",
        part_sami_number: "SAM-001",
        category: "Bearing",
        machine_spec: "Motor 3 Phase 2HP",
        machine_name: "Conveyor 1",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        location: "Gudang B",
        part_name: "Belt V-20",
        part_number: "BLT-V20",
        part_sami_number: "SAM-002",
        category: "Belt",
        machine_spec: "Mesin Packing",
        machine_name: "Packing Line 2",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        location: "Gudang C",
        part_name: "Sensor Proximity",
        part_number: "SNS-PRX-10",
        part_sami_number: "SAM-003",
        category: "Sensor",
        machine_spec: "PLC Omron",
        machine_name: "Filling Machine",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        location: "Gudang A",
        part_name: "Grease NLGI 2",
        part_number: "GRS-NLGI2",
        part_sami_number: "SAM-004",
        category: "Pelumas",
        machine_spec: "Gearbox",
        machine_name: "Conveyor 2",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        location: "Gudang B",
        part_name: "Filter Udara",
        part_number: "FLT-UDR-01",
        part_sami_number: "SAM-005",
        category: "Filter",
        machine_spec: "Compressor 5HP",
        machine_name: "Compressor Utama",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("spareparts", null, {});
  }
};