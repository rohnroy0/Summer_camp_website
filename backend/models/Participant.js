const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    college: {
        type: String,
        required: [true, 'College name is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required']
    },
    year: {
        type: String,
        required: [true, 'Year of study is required']
    },
    ticketId: {
        type: String,
        default: null
    },
    checkedIn: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    isIEEEMember: {
        type: Boolean,
        default: false
    },
    ieeeId: {
        type: String,
        default: null
    },
    paymentAmount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Participant', participantSchema);
