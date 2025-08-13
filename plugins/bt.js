const config = require('../config')
const os = require('os')
const fs = require('fs')
const l = console.log
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, Func, fetchJson} = require('../lib/functions')
let cap = '👨‍💻 ꜱᴇɴᴜ x ʙʏ ꜱxᴅ ᴛᴇᴀᴍ 👨‍💻'
const si = require('systeminformation')



//---------------------------------------------------------------------------
if (config.COMMAND_TYPE === 'button') {
//---------------------------------------------------------------------------



cmd({
    pattern: "menu5",
    react: "📖",
    alias: ["panel", "list", "commands", "cmd"],
    desc: "Get bot\'s command list.",
    category: "other",
    use: '.menu',
    filename: __filename
}, async (conn, mek, m, { from, prefix, pushname, reply }) => {
    try {
        let wm = `👨‍💻 ꜱᴇɴᴜ x ʙʏ ꜱxᴅ ᴛᴇᴀᴍ 👨‍💻`
        if (os.hostname().length == 12) hostname = 'replit'
        else if (os.hostname().length == 36) hostname = 'heroku'
        else if (os.hostname().length == 8) hostname = 'koyeb'
        else hostname = os.hostname()
        let monspace = '```'
            const MNG = `❖👨‍💻 ꜱᴇɴᴜ x ʙʏ ꜱxᴅ ᴛᴇᴀᴍ 👨‍💻❖
	    
${monspace}👋 ʜᴇʟʟᴏ ${pushname}${monspace}

╭───═❮ *ᴍᴇɴᴜ ʟɪsᴛ* ❯═───❖
│ *🚀ᴠᴇʀꜱɪᴏɴ:* ${require("../package.json").version}
│ *⌛ᴍᴇᴍᴏʀʏ:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
│ *🕒ʀᴜɴᴛɪᴍᴇ:* ${runtime(process.uptime())}
│ *📍ᴘʟᴀᴛꜰᴏʀᴍ:* ${hostname}
╰━━━━━━━━━━━━━━━┈⊷`
            const categories = [];
        const categoryMap = new Map();

        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            if (!cmd.dontAddCommandList && cmd.pattern !== undefined) {
                const category = cmd.category.toUpperCase();
                if (!categoryMap.has(category)) {
                    categories.push(category);
                    categoryMap.set(category, []);
                }
                categoryMap.get(category).push(cmd.pattern);
            }
        }

        const rows = []
        for (const category of categories) {
            rows.push({
                header: '',
                title: `${category} MENU`,
                description: '',
                id: `${prefix}category ${category}`
            })
        }

        let buttons = [{
                name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: config.BTN,
                        url: config.BTNURL,
                        merchant_url: config.BTNURL
                }),
            },
            {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                    title: 'Select a SubMenu',
                    sections: [{
                        title: 'Please select a SubMenu',
                        highlight_label: 'ꜱᴇɴᴜ x ʙᴏᴛ',
                        rows: rows
                    }]
                }),
            }
        ]

        let opts = {
            image: config.LOGO,
            header: '',
            footer: wm,
            body: MNG
        }

        return await conn.sendButtonMessage(from, buttons, m, opts)
    } catch (e) {
        reply('*Error !!*')
        console.log(e)
    }
})



cmd({
    pattern: "menu2",
    react: "📂",
    alias: ["help"],
    desc: "Get bot\'s command list.",
    category: "main",
    use: '.menu',
    filename: __filename
},
async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    let menuc1 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'download'){
if(!commands[i].dontAddCommandList){
menuc1 += `*◉ :* ${commands[i].pattern}\n`
}}};

let menuc2 = ``
for (let i=0;i<commands.length;i++) { 
  if(commands[i].category === 'search'){
  if(!commands[i].dontAddCommandList){
  menuc2 += `*◉ :* ${commands[i].pattern}\n`
}}};

let menuc3 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'convert'){
  if(!commands[i].dontAddCommandList){
    menuc3 += `*◉ :* ${commands[i].pattern}\n`
}}};

let menuc4 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'logo'){
  if(!commands[i].dontAddCommandList){
menuc4 += `*◉ :* ${commands[i].pattern}\n`
}}};

let menuc5 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'main'){
  if(!commands[i].dontAddCommandList){
menuc5 += `*◉ :* ${commands[i].pattern}\n`
}}};

let menuc6 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'group'){
if(!commands[i].dontAddCommandList){
  menuc6 += `*◉ :* ${commands[i].pattern}\n`
}}};

let menuc7 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'bug'){
if(!commands[i].dontAddCommandList){
  menuc7 += `*◉ :* ${commands[i].pattern}\n`
}}};

let menuc8 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'movie'){
if(!commands[i].dontAddCommandList){
  menuc8 += `*◉ :* ${commands[i].pattern}\n`
}}};	

let menuc9 = ``
for (let i=0;i<commands.length;i++) { 
if(commands[i].category === 'other'){
if(!commands[i].dontAddCommandList){
  menuc9 += `*◉ :* ${commands[i].pattern}\n`
}}};
     
let menumg = `*Hellow👸* ${pushname}

*╭─     ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ*
*│🕵️‍♂️ 𝘙𝘶𝘯 𝘛𝘪𝘮𝘦 -* ${runtime(process.uptime())} 
*│🕵️‍♂️ 𝘙𝘢𝘮 𝘜𝘴𝘦 -* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
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

👨‍💻 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴇɴᴜ x ʙᴏᴛ 👨‍💻`	
      
let wm = `👨‍💻 ᴊᴇꜱᴛᴇʀ ᴇxᴇ 👨‍💻`
             let buttons = [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: config.BTN,
                        url: config.BTNURL,
                        merchant_url: config.BTNURL
                    }),
                }
            ]
            let message = {
                image: config.LOGO,
                header: '',
                footer: config.FOOTER,
                body: menumg

            }
            return await conn.sendButtonMessage(from, buttons, m, message)
} catch (e) {
  reply('*ERROR !!*')
  console.log(e)
}
})



cmd({
    pattern: "category",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        let wm = '*ꜱᴇɴᴜ x ʙᴏᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ᴜꜱᴇʀ ʙᴏᴛ*\n*ᴛʜᴇ ᴛᴇᴀᴍ • ꜱᴇɴᴜ x ᴅᴇᴠᴇʟᴏᴘᴇʀꜱ*'
        const category = q.trim().toUpperCase();
        let commandList = `*◈╾────${category} SUB COMMAND LIST────╼◈*\n\n> Select you want command type and enjoy Senu x whatsapp bot 👨‍💻\n\n`;

        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            if (cmd.category.toUpperCase() === category) {
                commandList += `╭────────●●►\n│ • *${cmd.pattern}* \n╰────────────────────●●►\n`;
            }
        }

        commandList += `\n⭓ *Total Commands List ${category}*: ${commands.filter(cmd => cmd.category.toUpperCase() === category).length}\n\n${wm}`

        //await conn.sendMessage(from, { text: commandList }, { quoted: mek });
        await conn.sendMessage(from, {
text: commandList,
  contextInfo: {
    mentionedJid: [ '' ],
    groupMentions: [],
    forwardingScore: 1111,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363388320701164@newsletter',
      serverMessageId: 127
    },
externalAdReply: { 
title: '👨‍💻 ꜱᴇɴᴜ x ʙʏ ᴊᴇꜱᴛᴇʀ 👨‍💻',
body: 'ᴀ ꜱɪᴍᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ',
mediaType: 1,
sourceUrl: "https://whatsapp.com/channel/0029Vb2OcviBFLgPzVjWhE0n" ,
thumbnailUrl: config.LOGO ,
renderLargerThumbnail: true,
showAdAttribution: false
}
}}, { quoted: mek})
    } catch (e) {
        reply('*Error !!*')
        console.log(e)
    }
})


//==================================================================	


        






cmd({
        pattern: "alive5",
        react: "🍬",
        desc: "Check bot online or no.",
        category: "main",
        use: '.alive',
        filename: __filename
    },
    async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
            if (os.hostname().length == 12) hostname = 'replit'
            else if (os.hostname().length == 36) hostname = 'heroku'
            else if (os.hostname().length == 8) hostname = 'koyeb'
            else hostname = os.hostname()
            let monspace = '```'
            const sssf = `${monspace}👋 𝐇ello ${pushname} 𝐈'm 𝐀live 𝐍ow${monspace}

_*ᴛʜɪꜱ Qᴜᴇᴇɴ ꜱᴇɴᴜ ᴍᴅ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ɪꜱ ᴍᴀᴅᴇ ꜰᴏʀ ʏᴏᴜʀ ᴇᴀꜱʏ ᴛᴏ ᴜꜱᴇ. ᴛʜɪꜱ ʙᴏᴛ ɪꜱ ᴄᴜʀʀᴇɴᴛʟʏ ᴀᴄᴛɪᴠᴇ🪄*_
    
> *𝐕ᴇʀꜱɪᴏɴ:* ${require("../package.json").version}
> *𝐌ᴇᴍᴏʀʏ:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
> *𝐑ᴜɴᴛɪᴍᴇ:* ${runtime(process.uptime())}
> *𝐏ʟᴀᴛꜰᴏʀᴍ:* ${hostname}

🐼𝐓ʜᴇ 𝐌ᴀɪɴ 𝐇ᴏᴘᴇ 𝐎ꜰ 𝐂ʀᴇᴀᴛɪɴɢ 𝐓ʜɪꜱ 𝐁ᴏᴛ 𝐈s 𝐓o 𝐓ᴀᴋᴇ 𝐅uʟʟ 𝐀ᴅᴠᴀɴᴛᴀɢᴇ 𝐎ꜰ 𝐓ʜᴇ 𝐖ʜᴀᴛꜱᴀᴘᴘ 𝐀ᴘᴘ 𝐀ɴᴅ 𝐌ᴀᴋᴇ 𝐈ᴛꜱ 𝐖ᴏʀᴋ 𝐄ᴀꜱɪᴇʀ🧚‍♂️
                    	    
*☘️ ꜰᴏʟʟᴏᴡ ᴍʏ ᴄʜᴀɴɴᴇʟ:* https://whatsapp.com/channel/0029Vb2OcviBFLgPzVjWhE0n`

            let buttons = [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: config.BTN,
                        url: config.BTNURL,
                        merchant_url: config.BTNURL
                    }),
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Get Menu",
                        id: `${prefix}menu`
                    }),
                }
            ]
            let opts = {
                image: config.LOGO,
                header: '',
                footer: config.FOOTER,
                body: sssf

            }
            return await conn.sendButtonMessage(from, buttons, m, opts)
        } catch (e) {
            reply('*Error !!*')
            console.log(e)
        }
    })





cmd({
        pattern: "sc",
        react: "🗃️",
        alias: ["repo", "system5", "status"],
        desc: "Get bot\'s command list.",
        category: "main",
        use: '.sc',
        filename: __filename
    },
    async(conn, mek, m,{from, prefix, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
            if (os.hostname().length == 12) hostname = 'replit'
            else if (os.hostname().length == 36) hostname = 'heroku'
            else if (os.hostname().length == 8) hostname = 'koyeb'
            else hostname = os.hostname()
            let monspace = '```'
            const MNG = `${monspace}👋 Hello ${pushname}${monspace}

*👾 SENU X BOT COMMANDS MENU...*
  
> *Version:* ${require("../package.json").version}
> *Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
> *Runtime:* ${runtime(process.uptime())}
> *Platform:* ${hostname}
  *SENU X WHATSAPP USER BOT* 💫

                     *MINE MISSION*

*This is the result of mine hard work and my SXD team owns the bots rights and code rights. Therefore, you have no chance to change and submit my bot under any circumstances And 100 Commands And logo, thumbnail,banner Maker Commands Ai Chatbot features On My Bot*🧚‍♀️

*The main hope of creating this bot is to take full advantage of the WhatsApp app and make its work easier*🧚‍♂️

`
            let buttons = [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: 'YT CHANNEL',
                        url: 'https://youtube.com/@jestertools360?si=4Ds50i6gx8_IrZol',
                        merchant_url: 'https://youtube.com/@jestertools360?si=4Ds50i6gx8_IrZol'
                    }),
                },
	        {	 
		name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: 'FB PAGE',
                        url: 'https://www.facebook.com/profile.php?id=61574870433157',
                        merchant_url: 'https://www.facebook.com/profile.php?id=61574870433157'
                   }),	
		},
		{	 
		name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: 'MY WA NUMBER',
                        url: 'https://wa.me/94788770020',
                        merchant_url: 'https://wa.me/94788770020'
                   }),	
		},	   
		{	 
		name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: 'MY WA CHANNEL',
                        url: 'https://whatsapp.com/channel/0029Vb2OcviBFLgPzVjWhE0n',
                        merchant_url: 'https://whatsapp.com/channel/0029Vb2OcviBFLgPzVjWhE0n'
                   }),	
		},	
                {	 
		name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: 'MY BOT REPO',
                        url: 'https://github.com/Gehansasl/SENU-X-BOT',
                        merchant_url: 'https://github.com/Gehansasl/SENU-X-BOT'
                   }),	
		},
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "Get Menu",
                        id: `${prefix}menu`
                    }),
                }
            ]
            let opts = {
                image: config.LOGO,
                header: '',
                footer: config.FOOTER,
                body: MNG

            }
            return await conn.sendButtonMessage(from, buttons, m, opts)
        } catch (e) {
            reply('*Error !!*')
            console.log(e)
        }
    })




//---------------------------------------------------------------------------
}
//---------------------------------------------------------------------------


cmd({
    pattern: "system",
    react: "🖥️",
    alias: ["s_info"],
    desc: "To Check bot\'s System information",
    category: "main",
    use: '.system',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const ccp = await si.cpu()
const cinfo = await si.version()
let timee = await si.time()
const plat = os.hostname()
let data = await fetchJson('https://gist.github.com/VajiraTech/c4f2ac834de5c45b3a8de8e2d165f973/raw')

if ( plat.length > 15 ) {
const infomsg = `🖥️  *SENU X BOT 2.0 SYSTEM INFORMATIONS*  🖥️

🤖  *_Bot's System informations_*

1.  _Runtime -: ${runtime(process.uptime())}_
2.  _Ram Usage -: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB_
3.  _Bot Version -: ${data.version} Stable_

📶  *_Server System informations_*

1.  _Platform : Heroku_
2.  _Running OS : ${os.platform()}_
3.  _CPU Manufacture  -: ${ccp.manufacturer}_
4.  _CPU Brand -: ${ccp.brand}_
5.  _CPU Speed -: ${ccp.speed}_

⚙️  *_System Data Collector Engine_*

1. _Engine Version -: ${cinfo}_

💻  *_Running Server's information_*

1. _Server Time Zone -: ${timee.timezone}_
2. _Time Zone Name -: ${timee.timezoneName}_`
return await conn.sendMessage(from , { text: infomsg  }, { quoted: mek } )

}


const infomsg = `🖥️  *SENU X BOT 5.0 SYSTEM INFORMATIONS*  🖥️

🤖  *_Bot's System informations_*

1.  _Runtime -: ${runtime(process.uptime())}_
2.  _Ram Usage -: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB_
3.  _Bot Version -: ${data.version} Stable_

📶  *_Server System informations_*

1.  _Platform : ${plat}_
2.  _Running OS : ${os.platform()}_
3.  _CPU Manufacture  -: ${ccp.manufacturer}_
4.  _CPU Brand -: ${ccp.brand}_
5.  _CPU Speed -: ${ccp.speed}_

⚙️  *_System Data Collector Engine_*

1. _Engine Version -: ${cinfo}_

💻  *_Running Server's information_*

1. _Server Time Zone -: ${timee.timezone}_
2. _Time Zone Name -: ${timee.timezoneName}_`
 await conn.sendMessage(from , { text: infomsg  }, { quoted: mek } )

}catch (e) {
reply('*Error !!*')
l(e)
}
})
			
