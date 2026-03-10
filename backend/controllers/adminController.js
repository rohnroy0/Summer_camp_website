const Participant = require('../models/Participant');

exports.getParticipants = async (req, res) => {
    try {
        const participants = await Participant.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: participants.length,
            data: participants
        });
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching participants' });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const successfulPayments = await Participant.find({ paymentStatus: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: successfulPayments.length,
            data: successfulPayments
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching payments' });
    }
};

exports.deleteParticipant = async (req, res) => {
    try {
        const participantId = req.params.id;

        const deletedParticipant = await Participant.findByIdAndDelete(participantId);

        if (!deletedParticipant) {
            return res.status(404).json({ success: false, message: 'Participant not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Participant successfully removed',
            data: {}
        });
    } catch (error) {
        console.error('Error deleting participant:', error);
        res.status(500).json({ success: false, message: 'Server error while deleting participant' });
    }
};

exports.checkInParticipant = async (req, res) => {
    try {
        const participantId = req.params.id;

        const updatedParticipant = await Participant.findByIdAndUpdate(
            participantId,
            { checkedIn: true },
            { new: true }
        );

        if (!updatedParticipant) {
            return res.status(404).json({ success: false, message: 'Participant not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Participant successfully checked in',
            data: updatedParticipant
        });
    } catch (error) {
        console.error('Error checking in participant:', error);
        res.status(500).json({ success: false, message: 'Server error while checking in participant' });
    }
};
