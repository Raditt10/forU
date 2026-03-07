const { Client, GatewayIntentBits } = require('discord.js');

function initializeDiscordBot() {
    const token = process.env.DISCORD_BOT_TOKEN;
    
    if (!token || token === 'YOUR_DISCORD_BOT_TOKEN') {
        console.log('Discord Bot Token not configured. Bot features disabled.');
        return null;
    }

    const client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent 
        ] 
    });

    client.once('ready', () => {
        console.log(`Discord Bot is online as ${client.user.tag}`);
    });

    client.on('messageCreate', (message) => {
        // Abaikan pesan dari bot sendiri agar tidak terjadi spam loop
        if (message.author.bot) return;

        // Command: !gombal [Nama]
        if (message.content.startsWith('!gombal ')) {
            const targetName = message.content.replace('!gombal ', '').trim();
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            
            // Encode nama agar aman di URL (misal Spasi menjadi %20)
            const encodedName = encodeURIComponent(targetName);
            const link = `${frontendUrl}/?target=${encodedName}`;

            message.reply(`Link gombalan spesial buat **${targetName}** udah siap nih!\nSilakan klik atau copas link ini:\n${link}`);
        }
    });

    client.login(token).catch(err => {
        console.error('Failed to start Discord Bot:', err.message);
    });

    return client;
}

module.exports = {
    initializeDiscordBot
};
