const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 2, // Default level untuk user biasa
    },
  }, {
    tableName: "roles", // Nama tabel di database
    underscored: true,  // Gunakan snake_case untuk nama kolom
    timestamps: false,
  });
  
  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: "role_id",
      as: "Users",
    });
  };

  return Role;
}