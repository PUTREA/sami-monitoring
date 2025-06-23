const express = require('express');
const router = express.Router();
const mroController = require('../controllers/mro/MroRequestController');
const { authMiddleware } = require('../middlewares/auth');
// Ambil data form awal
router.get('/form-options', mroController.getFormOptions);

// Ambil detail mesin berdasarkan lokasi
router.get('/machines/by-location/:location', mroController.getMachineDetails);

// Submit MRO request
router.post('/request', authMiddleware, mroController.createMroRequest);

// Accept MRO request dan langsung mulai mengerjakan (hanya teknisi)
router.post("/request/:id/accept", authMiddleware, mroController.acceptMroRequest)

// Complete MRO request (hanya teknisi)
router.post("/request/:id/complete", authMiddleware, mroController.completeMroRequest)

// ...
router.get('/carline-frequent', mroController.getMostFrequentCarline);
router.get('/summary', mroController.getMroRequestSummary);
module.exports = router;
