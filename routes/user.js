const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user/UserController");

// Endpoint untuk get semua users
router.get("/", UserController.getAllUsers);

module.exports = router;