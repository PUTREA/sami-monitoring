const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

module.exports = (sequelize, DataTypes) => {
  const Sparepart = sequelize.define("Sparepart", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_sami_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machine_spec: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machine_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: "spareparts",
    underscored: true,
    timestamps: true,
  });

  // Tambahkan asosiasi di sini jika ada relasi dengan model lain

  return Sparepart;
};