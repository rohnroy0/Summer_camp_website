const Razorpay = require('razorpay');
const crypto = require('crypto');
const Participant = require('../models/Participant');
const { sendConfirmationEmail } = require('../utils/emailService');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret'
});

exports.createOrder = async (req, res) => {
    try {
        const { participantId } = req.body;

        // Verify participant exists
        const participant = await Participant.findById(participantId);
        if (!participant) {
            return res.status(404).json({ success: false, message: 'Participant not found' });
        }

        if (participant.paymentStatus) {
            return res.status(400).json({ success: false, message: 'Payment already completed for this participant' });
        }

        const amount = participant.paymentAmount || 1999; // Fallback if not set
        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_${participantId}`
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            participant,
            key_id: process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id'
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Error creating payment order' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            participantId
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret')
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update database
            const participant = await Participant.findByIdAndUpdate(
                participantId,
                {
                    paymentStatus: true,
                    transactionId: razorpay_payment_id,
                    ticketId: 'TKT-' + crypto.randomBytes(4).toString('hex').toUpperCase()
                },
                { new: true }
            );

            // Send Email Confirmation
            if (participant) {
                await sendConfirmationEmail(participant);
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully and confirmation email sent',
                participant
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Server Error during payment verification' });
    }
};
