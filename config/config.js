require('dotenv').config();
const {
  DB_CONNECTION,
  DB_HOST,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD
} = process.env;

module.exports = {
    "development": {
      "username": DB_USERNAME,
      "password": DB_PASSWORD,
      "database": DB_DATABASE,
      "host": DB_HOST,
      "dialect": DB_CONNECTION,
    },
}