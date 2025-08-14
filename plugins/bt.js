const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

function replaceYouTubeID(url) {
  const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function sendUrlAsBuffer(conn, from, mek, downloadUrl, filename, type) {
  try {
    console.log('[DEBUG] Fetching downloadUrl:', downloadUrl);
    const res = await axios.get(downloadUrl, { responseType: 'arraybuffer', timeout: 120000 });
    const buffer = Buffer.from(res.data);
    const sizeMB = buffer.length / (1024 * 1024);
    console.log(`[DEBUG] Downloaded size: ${sizeMB.toFixed(2)} MB`);

    // safe threshold (WhatsApp often ~100MB, keep margin)
    if (sizeMB > 95) {
      // fallback: send as remote document (may fail if host blocks)
      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        fileName: filename,
        mimetype: 'video/mp4',
        caption: `${filename} (file too large: ${sizeMB.toFixed(1)} MB)`
      }, { quoted: mek });
      return;
    }

    // send video buffer
    await conn.sendMessage(from, { video: buffer, mimetype: 'video/mp4', fileName: filename, caption: filename }, { quoted: mek });
  } catch (err) {
    console.error('[ERROR] sendUrlAsBuffer:', err);
    // final fallback: try sending remote url as document
    try {
      await conn.sendMessage(from, { document: { url: downloadUrl }, fileName: filename, mimetype: 'video/mp4', caption: filename }, { quoted: mek });
    } catch (e2) {
      console.error('[ERROR] fallback send remote url:', e2);
      throw err;
    }
  }
}

cmd({
  pattern: "play4",
  alias: ["mp4", "ytv", "video"],
  react: "🎬",
  desc: "Download Ytmp4 (video)",
  category: "download",
  use: ".play4 <Text or YT URL>",
  filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
  try {
    if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

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
      `2.1 *Stream Video* 🎥 (attempt stream)\n` +
      `2.2 *Download as MP4 (Document)* 📁\n\n` +
      `${config.FOOTER || "𓆩JesterTechX𓆪"}`;

    const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
    await conn.sendMessage(from, { react: { text: '🎬', key: sentMsg.key } });

    // one-time listener
    const handler = async (messageUpdate) => {
      try {
        const mekInfo = messageUpdate?.messages?.[0];
        if (!mekInfo?.message) return;

        const context = mekInfo.message.extendedTextMessage?.contextInfo;
        const isReplyToSentMsg = context?.stanzaId === sentMsg.key.id;
        if (!isReplyToSentMsg) return;

        // remove listener immediately
        try { conn.ev.off('messages.upsert', handler); } catch (e) { /* ignore */ }

        const messageText = mekInfo.message.conversation || mekInfo.message.extendedTextMessage?.text || "";
        const userReply = messageText.trim();

        if (userReply === "2.1") {
          const processingMsg = await conn.sendMessage(from, { text: "⏳ Preparing stream..." }, { quoted: mek });
          const response = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`);
          // try common paths
          const downloadUrl = response?.result?.download?.url || response?.result?.url || response?.result?.link;
          if (!downloadUrl) {
            console.log('DEBUG: full response:', JSON.stringify(response, null, 2));
            return await reply("❌ Download link not found! (check console)");
          }

          // try to send as url video (stream). If fails fallback to buffer.
          try {
            await conn.sendMessage(from, { video: { url: downloadUrl }, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: title }, { quoted: mek });
            await conn.sendMessage(from, { text: '✅ Video stream sent ✅', edit: processingMsg.key });
          } catch (eStream) {
            console.warn('[WARN] stream failed, trying buffer send', eStream);
            await sendUrlAsBuffer(conn, from, mek, downloadUrl, `${title}.mp4`, 'video');
            await conn.sendMessage(from, { text: '✅ Video sent via buffer ✅', edit: processingMsg.key });
          }

        } else if (userReply === "2.2") {
          const processingMsg = await conn.sendMessage(from, { text: "⏳ Preparing file..." }, { quoted: mek });
          const response = await dy_scrap.ytmp4(`https://youtube.com/watch?v=${id}`);
          const downloadUrl = response?.result?.download?.url || response?.result?.url || response?.result?.link;
          if (!downloadUrl) {
            console.log('DEBUG: full response:', JSON.stringify(response, null, 2));
            return await reply("❌ Download link not found! (check console)");
          }

          // prefer buffered send for reliability (but will fallback if too large)
          await sendUrlAsBuffer(conn, from, mek, downloadUrl, `${title}.mp4`, 'video');
          await conn.sendMessage(from, { text: '✅ File upload attempt finished ✅', edit: processingMsg.key });

        } else {
          return await reply("❌ Invalid choice! Reply with 2.1 or 2.2.");
        }

      } catch (error) {
        console.error(error);
        try { conn.ev.off('messages.upsert', handler); } catch (e) { }
        await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
      }
    };

    conn.ev.on('messages.upsert', handler);

    // safety: auto-remove after 2 minutes
    setTimeout(() => {
      try { conn.ev.off('messages.upsert', handler); } catch (e) { }
    }, 2 * 60 * 1000);

  } catch (error) {
    console.error(error);
    try { await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }); } catch (e) { }
    await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
  }
});
