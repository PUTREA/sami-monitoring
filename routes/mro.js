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

// Overview API
router.get('/overview', mroController.getOverview);

// Search API
router.get('/search', mroController.searchMroRequests);

// Status Summary API
router.get('/status-summary', mroController.getStatusSummary);

module.exports = router;
