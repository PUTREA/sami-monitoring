const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user/UserController");

// Endpoint untuk get semua users
router.get("/", UserController.getAllUsers);
router.get("/export-excel", UserController.exportUsersToExcel);
router.get("/export-pdf", UserController.exportUsersToPDF);
router.post("/create", UserController.createUser);
module.exports = router;