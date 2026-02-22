require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Interaction = require('./models/Interaction');
const { sendDiscordNotification } = require('./utils/discord');
const { initializeDiscordBot } = require('./utils/discordBot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

let isDbConnected = false;

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/forU';
mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        isDbConnected = true;
    })
    .catch(err => console.error('Could not connect to MongoDB (Data will only be sent to Discord):', err.message));

// Routes
app.post('/api/track', async (req, res) => {
    try {
        const { targetName, noClicks, success } = req.body;

        let newInteraction = null;
        if (isDbConnected) {
            newInteraction = new Interaction({
                targetName: targetName || 'Unknown',
                noClicks: noClicks || 0,
                success: success || false
            });
            await newInteraction.save();
        }

        if (success) {
            await sendDiscordNotification({ targetName, noClicks, success });
        }

        res.status(201).json({ message: 'Interaction tracked successfully', data: newInteraction });
    } catch (error) {
        console.error('Tracking Error:', error);
        res.status(500).json({ error: 'Failed to track interaction', details: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Sigma API is running smoothly' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Mulai Bot Discord berbarengan dengan Server
    initializeDiscordBot();
});
