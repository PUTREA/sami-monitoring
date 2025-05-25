const express = require("express");
const router = express.Router();
const SparepartController = require("../controllers/sparepart/SparepartController");

// Endpoint untuk spareparts
router.get("/", SparepartController.getAllSpareparts);
router.post("/", SparepartController.createSparepart);
router.post("/import", SparepartController.importSparepartsFromExcel);
router.post("/:id", SparepartController.updateSparepart);
router.get("/search", SparepartController.searchSpareparts);
router.get("/filter", SparepartController.filterSpareparts);
router.get("/export-excel", SparepartController.exportSparepartsToExcel);
router.get("/export-pdf", SparepartController.exportSparepartsToPDF);
router.get("/:id", SparepartController.getSparepartById);
router.delete("/:id", SparepartController.deleteSparepart);

module.exports = router;