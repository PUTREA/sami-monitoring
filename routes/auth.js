const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth/AuthController');
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');

router.post('/login', AuthController.login);

// router.get('/profile', auth, AuthController.profile);
// router.get('/admin-dashboard', auth, role(1), (req, res) => {
//   res.json({ message: 'Selamat datang di dashboard admin' });
// });

module.exports = router;