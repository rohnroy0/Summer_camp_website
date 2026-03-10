const express = require('express');
const router = express.Router();
const { registerParticipant } = require('../controllers/registerController');
const { validateRegistration } = require('../middleware/validation');

// @route   POST /api/register
// @desc    Accept participant details temporarily
// @access  Public
router.post('/', validateRegistration, registerParticipant);

module.exports = router;
