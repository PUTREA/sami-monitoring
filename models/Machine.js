const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

module.exports = (sequelize, DataTypes) => {
  const Machine = sequelize.define("Machine", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    machine_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    machine_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    carline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Machine;
};