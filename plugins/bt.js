// menu2 without buttons (image + caption only)

const config = require('../config')
const { cmd, commands } = require('..command')
const { runtime } = require('../lib/functions')

cmd({
  pattern: "menu5",
  react: "📂",
  alias: ["help"],
  desc: "Get bot's command list.",
  category: "main",
  use: '.menu',
  filename: __filename
},
async (conn, mek, m, { from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    // build category helpers
    const listByCat = (cat) => {
      let out = ''
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].category === cat) {
          if (!commands[i].dontAddCommandList) {
            out += `*◉ :* ${commands[i].pattern}\n`
          }
        }
      }
      return out
    }

    const menuc1 = listByCat('download')
    const menuc2 = listByCat('search')
    const menuc3 = listByCat('convert')
    const menuc4 = listByCat('logo')
    const menuc5 = listByCat('main')
    const menuc6 = listByCat('group')
    const menuc7 = listByCat('bug')
    const menuc8 = listByCat('movie')
    const menuc9 = listByCat('other')

    const menumg = `*Hellow👸* ${pushname}

*╭─     ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ*
*│🕵️‍♂️ 𝘙𝘶𝘯 𝘛𝘪𝘮𝘦 -* ${runtime(process.uptime())} 
*│🕵️‍♂️ 𝘙𝘢𝘮 𝘜𝘴𝘦 -* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem() / 1024 / 1024)}MB
*╰──────────●●►*
*👸 SENU X BOT COMMAND PANEL*

> *╭──────────●●►*
> *│🧙‍♂️ DOWNLOAD COMMANDS*
> *│   ───────*
${menuc1}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ SEARCH COMMANDS*
> *│   ───────*
${menuc2}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ CONVERT COMMANDS*
> *│   ───────*
${menuc3}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ LOGO COMMANDS*
> *│   ───────*
${menuc4}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ MAIN COMMANDS*
> *│   ───────*
${menuc5}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ GROUP COMMANDS*
> *│   ───────*
${menuc6}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ BUG COMMANDS*
> *│   ───────*
${menuc7}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ MOVIE COMMANDS*
> *│   ───────*
${menuc8}*╰───────────●●►*

> *╭──────────●●►*
> *│🧙‍♂️ OTHER COMMANDS*
> *│   ───────*
${menuc9}*╰───────────●●►*

👨‍💻 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴇɴᴜ x ʙᴏᴛ 👨‍💻
${config.FOOTER ? `\n${config.FOOTER}` : ''}`

    // Prepare image payload (URL or Buffer supported)
    const imagePayload = (typeof config.LOGO === 'string')
      ? { url: config.LOGO }
      : config.LOGO

    // Send as normal image+caption (NO BUTTONS)
    await conn.sendMessage(
      from,
      { image: imagePayload, caption: menumg },
      { quoted: m }
    )

  } catch (e) {
    console.log('menu2 error:', e)
    try {
      // Fallback: send as plain text if image fails
      await conn.sendMessage(from, { text: menumg }, { quoted: m })
    } catch (err) {
      console.log('menu2 fallback error:', err)
      reply('*ERROR !!*')
    }
  }
})
