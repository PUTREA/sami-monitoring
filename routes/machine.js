const express = require("express");
const router = express.Router();
const MachineController = require("../controllers/machine/MachineController");
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

// Endpoint untuk machines
router.get("/", MachineController.getAllMachines);
router.post("/", MachineController.createMachine);
router.post("/import", MachineController.importMachinesFromExcel);
router.post("/:id", MachineController.updateMachine);
router.delete("/:id", MachineController.deleteMachine);

router.get("/search", MachineController.searchMachines);
router.get("/filter", MachineController.filterMachines);


router.get("/export-excel", MachineController.exportMachinesToExcel);
router.get("/export-pdf", MachineController.exportMachinesToPDF);

// Endpoint untuk get semua machines dengan middleware auth dan role checke
// router.get("/", authMiddleware, MachineController.getAllMachines);
// router.get("/export-excel", authMiddleware, MachineController.exportMachinesToExcel);
// router.get("/export-pdf", authMiddleware, MachineController.exportMachinesToPDF);
// router.post("/create", authMiddleware, roleMiddleware('SUPERVISOR'), MachineController.createMachine);
// router.get("/search", authMiddleware, MachineController.searchMachines);
// router.get("/filter", authMiddleware, MachineController.filterMachines);
// router.get("/:id", authMiddleware, MachineController.getMachineById);
// router.post('/update/:id', authMiddleware, roleMiddleware('SUPERVISOR'), MachineController.updateMachine);
// router.delete('/delete/:id', authMiddleware, roleMiddleware('SUPERVISOR'), MachineController.deleteMachine);

module.exports = router;