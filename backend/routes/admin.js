const express = require('express');
const router = express.Router();
const { getParticipants, getPayments, deleteParticipant, checkInParticipant } = require('../controllers/adminController');

// @route   GET /api/admin/participants
// @desc    Return a list of all participants
// @access  Admin (Public for now, consider adding JWT authentication later)
router.get('/participants', getParticipants);

// @route   GET /api/admin/payments
// @desc    Return all successful payments
// @access  Admin
router.get('/payments', getPayments);

// @route   DELETE /api/admin/participant/:id
// @desc    Remove a participant entry
// @access  Admin
router.delete('/participant/:id', deleteParticipant);

// @route   PUT /api/admin/participant/:id/checkin
// @desc    Mark a participant as checked in
// @access  Admin
router.put('/participant/:id/checkin', checkInParticipant);

module.exports = router;
