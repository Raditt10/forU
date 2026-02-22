const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    targetName: {
        type: String,
        required: true,
        default: 'Unknown'
    },
    noClicks: {
        type: Number,
        default: 0
    },
    success: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Interaction', interactionSchema);
