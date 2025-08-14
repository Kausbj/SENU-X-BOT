const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
  if (!url || typeof url !== 'string') return null;
  const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getTextFromMessage(message) {
  if (!message) return "";
  if (typeof message === 'string') return message;
  if (message.conversation) return message.conversation;
  if (message.extendedTextMessage?.text) return message.extendedTextMessage.text;
  if (message.imageMessage?.caption) return message.imageMessage.caption;
  if (message.videoMessage?.caption) return message.videoMessage.caption;
  if (message.buttonsResponseMessage?.selectedButtonId) return message.buttonsResponseMessage.selectedButtonId;
  if (message.listResponseMessage?.singleSelectReply?.selectedRowId) return message.listResponseMessage.singleSelectReply.selectedRowId;
  return "";
}

cmd({
  pattern: "song6",
  alias: ["yt", "play"],
  react: "🎵",
  desc: "Download Ytmp3",
  category: "download",
  use: ".song <Text or YT URL>",
  filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
  try {
    if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

    // try to extract an ID from any kind of input first
    let id = replaceYouTubeID(q);

    // if no id found, search
    if (!id) {
      const searchResults = await dy_scrap.ytsearch(q);
      if (!searchResults?.results?.length) return await reply("❌ No results found!");
      id = searchResults.results[0].videoId;
    }

    const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
    if (!data?.results?.length) return await reply("❌ Failed to fetch video!");

    const { url, title, image, timestamp, ago, views, author } = data.results[0];

    let info = `🎵 *KAVI-MD SONG DL* 🎵\n\n` +
      `🏮 *Title:* ${title || "Unknown"}\n` +
      `⏳ *Duration:* ${timestamp || "Unknown"}\n` +
      `👀 *Views:* ${views || "Unknown"}\n` +
      `🌏 *Release Ago:* ${ago || "Unknown"}\n` +
      `👤 *Author:* ${author?.name || "Unknown"}\n` +
      `🖇 *Url:* ${url || "Unknown"}\n\n` +
      `🔢 *_Reply with your choice:-_*\n` +
      `1.1 *Audio Type* 🎵\n` +
      `1.2 *Document Type* 📁\n\n` +
      `${config.FOOTER || "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ 👨‍💻*"}`;

    const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
    const messageID = sentMsg.key.id;

    // react to the menu (non-blocking)
    try { await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } }); } catch (e) { /* ignore */ }

    // Handler function (kept as named function so we can off() it)
    const handler = async (messageUpdate) => {
      try {
        const mekInfo = messageUpdate?.messages?.[0];
        if (!mekInfo || !mekInfo.message) return;

        // ignore messages from the bot itself
        if (mekInfo.key?.fromMe) return;

        // ensure the reply is to our menu message
        const context = mekInfo.message.extendedTextMessage?.contextInfo;
        const isReplyToSentMsg = context?.stanzaId === messageID;
        if (!isReplyToSentMsg) return;

        // ensure same user who invoked the command is replying (group or private)
        const originalSender = mek.key?.participant || mek.key?.remoteJid || mek.key?.fromMe;
        const replier = mekInfo.key?.participant || mekInfo.key?.remoteJid;
        // In private chats remoteJid will be same, in groups participant should match.
        if (mek.key?.remoteJid && mek.key.remoteJid === mekInfo.key.remoteJid && mekInfo.key.fromMe) {
          // edge case: ignore messages from me
          return;
        }
        // If participant exists on original and replier exists, compare them.
        if (mek.key?.participant && mekInfo.key?.participant && mekInfo.key.participant !== mek.key.participant) {
          // different participant in group -> ignore
          return;
        }

        const userReplyRaw = getTextFromMessage(mekInfo.message).trim();
        if (!userReplyRaw) return;

        // accept both "1.1" and "1.1 " or case-insensitive variants (though numbers are exact)
        const userReply = userReplyRaw.split(/\s+/)[0].toLowerCase();

        // send pending message
        let statusMsg = await conn.sendMessage(from, { text: "*_🎼 Pending your request. . . .⌛_*" }, { quoted: mek });

        // fetch download link once, reuse for both options
        const res = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
        const downloadUrl = res?.result?.download?.url;
        if (!downloadUrl) {
          await conn.sendMessage(from, { text: "❌ Download link not found!" }, { quoted: mek });
          return;
        }

        if (userReply === "1.1") {
          // send as audio
          await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
        } else if (userReply === "1.2") {
          // send as document
          const docMsg = {
            document: {
              url: downloadUrl,
              fileName: `♬ ᴋᴀᴠɪ-ᴍᴅ ♬ ${title || "song"}.mp3`,
              mimetype: "audio/mpeg"
            },
            caption: String(config.FOOTER || "> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴠɪᴅᴜ ʀᴀꜱᴀɴɢᴀ 👨‍💻*")
          };
          await conn.sendMessage(from, docMsg, { quoted: mek });
        } else {
          await conn.sendMessage(from, { text: "❌ Invalid choice! Reply with 1.1 or 1.2." }, { quoted: mek });
        }

        // try to edit status message; if edit unsupported, send a new message
        try {
          await conn.sendMessage(from, { text: '*_Your request upload successful ☑️_*', edit: statusMsg.key });
        } catch (e) {
          await conn.sendMessage(from, { text: '*_Your request upload successful ☑️_*' }, { quoted: mek });
        }

      } catch (err) {
        console.error("handler error:", err);
        try { await conn.sendMessage(from, { text: `❌ *An error occurred while processing:* ${err.message || "Error!"}` }, { quoted: mek }); } catch (_) {}
      } finally {
        // remove handler and clear timeout (to avoid memory leaks)
        try { conn.ev.off('messages.upsert', handler); } catch (e) {}
        if (timeoutRef) clearTimeout(timeoutRef);
      }
    };

    // attach handler
    conn.ev.on('messages.upsert', handler);

    // safety: auto-remove listener after 60 seconds if no reply (prevents leaks)
    const TIMEOUT_MS = 60 * 1000;
    const timeoutRef = setTimeout(() => {
      try { conn.ev.off('messages.upsert', handler); } catch (e) {}
    }, TIMEOUT_MS);

  } catch (error) {
    console.error(error);
    try { await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }); } catch (_) {}
    await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
  }
});
