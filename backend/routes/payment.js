const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// @route   POST /api/create-order
// @desc    Create a Razorpay order
// @access  Public
router.post('/create-order', createOrder);

// @route   POST /api/verify-payment
// @desc    Verify Razorpay payment
// @access  Public
router.post('/verify-payment', verifyPayment);

module.exports = router;
