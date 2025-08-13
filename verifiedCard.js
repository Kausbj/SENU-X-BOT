// verifiedCard.js
async function sendVerified(conn, from) {
    const newsletterInfo = {
        key: {
            remoteJid: 'status@broadcast',
            participant: '0@s.whatsapp.net'
        },
        message: {
            newsletterAdminInviteMessage: {
                newsletterJid: '120363417070951702@newsletter',
                newsletterName: "MOVIE CIRCLE",
                caption: "𝙳𝙴𝚃𝙰𝙸𝙻𝚂 𝙲𝙰𝚁𝙳 𝚅𝙴𝚁𝙸𝙵𝙸𝙴𝙳 𝙱𝚈 𝙺𝙰𝚅𝙸𝙳𝚄 𝚁𝙰𝚂𝙰𝙽𝙶𝙰",
                inviteExpiration: 0
            }
        }
    };

    await conn.sendMessage(from, {}, { quoted: newsletterInfo });
}

module.exports = { sendVerified };
