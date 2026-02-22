const fetch = require('node-fetch') || global.fetch;

async function sendDiscordNotification(data) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    
    if (!webhookUrl || webhookUrl === 'YOUR_DISCORD_WEBHOOK_URL') {
        console.log('Discord Webhook URL not configured. Skipping notification.');
        return;
    }

    const { targetName, noClicks, success } = data;
    
    let message = '';
    if (success) {
        message = `🎉 **Misi Berhasil!**\nTarget **${targetName || 'Seseorang'}** akhirnya bilang YES setelah **${noClicks}** kali nolak!`;
    } else {
         message = `👀 **Update Gombalan:**\nTarget **${targetName || 'Seseorang'}** udah neken NO **${noClicks}** kali dan kabur!`;
    }

    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: message,
                username: "Rizz Bot",
                avatar_url: "https://i.pinimg.com/736x/e4/72/4d/e4724dc43d60d24fa01eda5d6614715a.jpg"
            })
        });
        console.log('Discord notification sent safely!');
    } catch (error) {
        console.error('Failed to send Discord notification:', error);
    }
}

module.exports = {
    sendDiscordNotification
};
