const express = require("express");
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.get("/", (req, res) => {
  res.send("Welcome to Sami Monitoring API!");
});

router.get("/supervisor",
  authMiddleware,
  roleMiddleware('supervisor'),
  (req, res) => {
    res.json({
     message: "hanya supervisor yang dapat akses ini"
    })
});

router.get("/line-leader",
  authMiddleware,
  roleMiddleware('line leader'),
  (req, res) => {
    res.json({
     message: "hanya line leader dan supervisor yang dapat akses ini"
  })
});

router.get("/teknisi",
  authMiddleware,
  roleMiddleware('teknisi'),
  (req, res) => {
    res.json({
      message: "page teknisi dapat diakses semua role"
    })
});

module.exports = router;
