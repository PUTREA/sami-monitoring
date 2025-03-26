const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = require('../config/connection');

// 1. Scan semua file di folder models
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Skip file hidden
      file !== basename && // Skip file index.js
      file.slice(-3) === '.js' // Ambil hanya file .js
    );
  })
  // 2. Load setiap model
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log(`Registered model: ${model.name}`); // <-- Tambahkan ini
    db[model.name] = model;
  });

// 3. Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Panggil fungsi associate jika ada
  }
});

// 4. Ekspos instance dan class
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;