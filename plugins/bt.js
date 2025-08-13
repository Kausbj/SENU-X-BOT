const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

// Categories with names, icons, and display numbers
const menuCategories = [
    { key: 'download', icon: '📥', title: 'Download Menu' },
    { key: 'group', icon: '👥', title: 'Group Menu' },
    { key: 'fun', icon: '😄', title: 'Fun Menu' },
    { key: 'owner', icon: '👑', title: 'Owner Menu' },
    { key: 'ai', icon: '🤖', title: 'AI Menu' },
    { key: 'anime', icon: '🎎', title: 'Anime Menu' },
    { key: 'convert', icon: '🔄', title: 'Convert Menu' },
    { key: 'other', icon: '📌', title: 'Other Menu' },
    { key: 'reactions', icon: '💞', title: 'Reactions Menu' },
    { key: 'main', icon: '🏠', title: 'Main Menu' }
];

// Helper to get commands by category
function getCommandsByCategory(cat) {
    return commands
        .filter(c => c.category === cat && !c.dontAddCommandList)
        .map(c => `*◉ :* ${c.pattern}`)
        .join("\n") || "_No commands available_";
}

cmd({
    pattern: "menu5",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        // Main Menu Caption
        let menuCaption = `*⎠👨‍💻 ᴋᴀᴠɪ ᴍᴅ ʙʏ ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ 👨‍💻⎝* 
        
╭━━━〔 *🫧 𝘒𝘈𝘝𝘐 -𝘔𝘋 🫧* 〕━━━╌●◈◆
> ☬ Owner : *${config.OWNER_NAME}*
> ☬ Mode : *[${config.MODE}]*
> ☬ Prefix : *[${config.PREFIX}]*
> ☬ Version : *0.0.1 Beta*
> ☬ Commands : *${commands.length}*
╰━━━━━━━━━━━━━━━╌●◈◆
╭━━〔 *🧚‍♂️ Menu List 🧚‍♂️* 〕━━┈⊷`;

        menuCategories.forEach((cat, index) => {
            menuCaption += `\n│ *➤ ${index + 1} *${cat.title}*`;
        });

        menuCaption += `\n╰──────────────┈⊷\n*_🔢 Reply with a number (1-${menuCategories.length}) to see commands_*`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        };

        // Send Menu Image
        const sentMsg = await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/p8knwg.jpg' },
                caption: menuCaption,
                contextInfo
            },
            { quoted: mek }
        );

        const messageID = sentMsg.key.id;

        // Build dynamic menu data
        const menuData = {};
        menuCategories.forEach((cat, idx) => {
            menuData[(idx + 1).toString()] = {
                title: `${cat.icon} *${cat.title}* ${cat.icon}`,
                content: `*⎠👨‍💻 ᴋᴀᴠɪ-ᴍᴅ ʙʏ ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ 👨‍💻⎝*\n\n╭━━━〔 *${cat.title}* 〕━━━┈⊷\n${getCommandsByCategory(cat.key)}\n╰━━━━━━━━━━━━━━━┈⊷\n> ${config.DESCRIPTION}`,
                image: true
            };
        });

        // Listen for replies
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message) return;

                const isReplyToMenu = receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                if (isReplyToMenu) {
                    const replyText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
                    const selectedMenu = menuData[replyText];
                    const senderID = receivedMsg.key.remoteJid;

                    if (selectedMenu) {
                        await conn.sendMessage(senderID, {
                            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/p8knwg.jpg' },
                            caption: selectedMenu.content,
                            contextInfo
                        }, { quoted: receivedMsg });
                        await conn.sendMessage(senderID, { react: { text: '✅', key: receivedMsg.key } });
                    } else {
                        await conn.sendMessage(senderID, {
                            text: `❌ Invalid Option!\nReply with a number between 1-${menuCategories.length}.\n\n◆ᴋᴀᴠɪ ᴍᴅ◆`,
                            contextInfo
                        }, { quoted: receivedMsg });
                    }
                }
            } catch (e) {
                console.error('Reply Handler Error:', e);
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) {
        console.error('Menu Error:', e);
    }
});
