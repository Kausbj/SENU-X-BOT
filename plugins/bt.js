const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

// Corrected YouTube ID extractor
function replaceYouTubeID(url) {
  const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

cmd({
  pattern: "play4",
  alias: ["mp4", "ytv", "video"],
  react: "🎬",
  desc: "Download Ytmp4 (video)",
  category: "download",
  use: ".play4 <query|url>",
  filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
  try {
    if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

    // get ID (if url) or search
    let id = q.startsWith("http") ? replaceYouTubeID(q) : null;
    if (!id) {
      const searchResults = await dy_scrap.ytsearch(q);
      if (!searchResults?.results?.length) return await reply("❌ No results found!");
      id = searchResults.results[0].videoId;
    }

    const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
    if (!data?.results?.length) return await reply("❌ Failed to fetch video!");
    const { url, title, image, timestamp, ago, views, author } = data.results[0];

    let info = `🍄 *SENU-MD VIDEO DL* 🍄\n\n` +
      `🎬 *Title:* ${title || "Unknown"}\n` +
      `⏳ *Duration:* ${timestamp || "Unknown"}\n` +
      `👀 *Views:* ${views || "Unknown"}\n` +
      `🌏 *Release Ago:* ${ago || "Unknown"}\n` +
      `👤 *Author:* ${author?.name || "Unknown"}\n` +
      `🖇 *Url:* ${url || "Unknown"}\n\n` +
      `🔽 *Reply with your choice:*\n` +
      `2.1 *Video Type (Stream)* 🎥\n` +
      `2.2 *Document Type (MP4 File)* 📁\n\n` +
      `${config.FOOTER || "𓆩JesterTechX𓆪"}`;

    const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: '🎬', key: sentMsg.key } });

    // single-use handler
    const handler = async (messageUpdate) => {
      try {
        const mekInfo = messageUpdate?.messages?.[0];
        if (!mekInfo?.message) return;
        // ensure it's a reply to our sent message
        const context = mekInfo.message.extendedTextMessage?.contextInfo;
        const isReplyToSentMsg = context?.stanzaId === sentMsg.key.id || (mekInfo.key?.remoteJid === from && mekInfo.key?.id && mekInfo.key?.id === sentMsg.key.id);
        if (!isReplyToSentMsg) return;

        const messageText = mekInfo.message.conversation || mekInfo.message.extendedTextMessage?.text || "";
        const userReply = messageText.trim();

        // remove listener immediately (one-time)
        try { conn.ev.off('messages.upsert', handler); } catch (e) { /* ignore */ }

        if (userReply === "2.1") {
          const processingMsg = await conn.sendMessage(from, { text: "⏳ Preparing stream..." }, { quoted: mek });
          const response = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`); // ytmp4 for video
          const downloadUrl = response?.result?.download?.url || response?.result?.url;
          if (!downloadUrl) return await reply("❌ Download link not found!");

          // send as video (stream). Note: Baileys will fetch the url and stream it if allowed.
          const videoMsg = { video: { url: downloadUrl }, mimetype: "video/mp4", fileName: `${title}.mp4`, caption: title };
          await conn.sendMessage(from, videoMsg, { quoted: mek });
          await conn.sendMessage(from, { text: '✅ Video stream sent ✅', edit: processingMsg.key });

        } else if (userReply === "2.2") {
          const processingMsg = await conn.sendMessage(from, { text: "⏳ Preparing file..." }, { quoted: mek });
          const response = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`);
          const downloadUrl = response?.result?.download?.url || response?.result?.url;
          if (!downloadUrl) return await reply("❌ Download link not found!");

          const docMsg = {
            document: { url: downloadUrl },
            fileName: `${title}.mp4`,
            mimetype: "video/mp4",
            caption: title
          };
          await conn.sendMessage(from, docMsg, { quoted: mek });
          await conn.sendMessage(from, { text: '✅ File upload sent ✅', edit: processingMsg.key });

        } else {
          return await reply("❌ Invalid choice! Reply with 2.1 or 2.2.");
        }

      } catch (error) {
        console.error(error);
        try { conn.ev.off('messages.upsert', handler); } catch (e) { }
        await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
      }
    };

    // attach listener
    conn.ev.on('messages.upsert', handler);

    // optional: auto-remove listener after X ms to avoid leaks (e.g., 2 minutes)
    setTimeout(() => {
      try { conn.ev.off('messages.upsert', handler); } catch (e) { }
    }, 2 * 60 * 1000);

  } catch (error) {
    console.error(error);
    try { await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }); } catch (e) {}
    await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
  }
});
