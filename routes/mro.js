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

module.exports = router;
