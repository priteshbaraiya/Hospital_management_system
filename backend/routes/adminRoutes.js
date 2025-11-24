const express = require('express');
const router = express.Router();
const { loginAdmin, addAdmin, getAllAdmins, logoutAdmin } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.post('/add', protect, admin, addAdmin);
router.get('/', protect, admin, getAllAdmins);
router.post('/logout', logoutAdmin);

module.exports = router;