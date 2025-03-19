const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to Sami Monitoring API!");
});

module.exports = router;
