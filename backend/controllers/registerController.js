const Participant = require('../models/Participant');

exports.registerParticipant = async (req, res) => {
    try {
        const { name, email, phone, college, department, year, isIEEEMember, ieeeId } = req.body;

        const existingParticipant = await Participant.findOne({ email });
        if (existingParticipant) {
            return res.status(400).json({
                success: false,
                message: 'You have already registered with this email'
            });
        }

        // Pricing logic
        const fee = isIEEEMember ? 1499 : 1999;

        const newParticipant = new Participant({
            name,
            email,
            phone,
            college,
            department,
            year,
            isIEEEMember: !!isIEEEMember,
            ieeeId: isIEEEMember ? ieeeId : null,
            paymentAmount: fee,
            paymentStatus: false
        });

        const savedParticipant = await newParticipant.save();

        res.status(201).json({
            success: true,
            message: 'Participant registered temporarily, please proceed to payment.',
            participantId: savedParticipant._id,
            amount: fee
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error during registration' });
    }
};
