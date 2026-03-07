require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sendDiscordNotification } = require('./utils/discord');
const { initializeDiscordBot } = require('./utils/discordBot');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/track', async (req, res) => {
    try {
        const { targetName, noClicks, success } = req.body;

        if (success) {
            await sendDiscordNotification({ targetName, noClicks, success });
        }

        res.status(201).json({ message: 'Interaction tracked successfully' });
    } catch (error) {
        console.error('Tracking Error:', error);
        res.status(500).json({ error: 'Failed to track interaction', details: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running smoothly' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    initializeDiscordBot();
});
