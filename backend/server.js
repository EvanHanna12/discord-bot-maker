const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store active bots
const activeBots = new Map();

// Bot templates
const botTemplates = {
  moderation: {
    name: 'Moderation Bot',
    description: 'A comprehensive moderation bot with kick, ban, mute, and warning commands',
    features: ['Kick/Ban/Mute', 'Warning System', 'Auto-moderation', 'Logging'],
    commands: ['kick', 'ban', 'mute', 'warn', 'clear', 'slowmode', 'lockdown']
  },
  fun: {
    name: 'Fun Bot',
    description: 'Entertainment bot with games, memes, and interactive commands',
    features: ['Games', 'Meme Commands', 'Funny Responses', 'Interactive Features'],
    commands: ['8ball', 'meme', 'joke', 'coinflip', 'dice', 'rps', 'trivia']
  },
  modmail: {
    name: 'Modmail Bot',
    description: 'Private messaging system between users and moderators',
    features: ['Private Messaging', 'Ticket System', 'Auto-responses', 'Logging'],
    commands: ['ticket', 'close', 'reply', 'block', 'unblock']
  },
  music: {
    name: 'Music Bot',
    description: 'High-quality music bot with playlist support and audio controls',
    features: ['Music Playback', 'Playlists', 'Queue Management', 'Audio Controls'],
    commands: ['play', 'skip', 'pause', 'resume', 'queue', 'volume', 'stop']
  },
  utility: {
    name: 'Utility Bot',
    description: 'Useful tools and utilities for server management',
    features: ['Server Info', 'User Info', 'Role Management', 'Custom Commands'],
    commands: ['serverinfo', 'userinfo', 'role', 'ping', 'avatar', 'embed']
  }
};

// Routes
app.get('/api/templates', (req, res) => {
  res.json(botTemplates);
});

app.post('/api/generate-bot', async (req, res) => {
  try {
    const { template, botName, botToken, prefix, features } = req.body;
    
    if (!template || !botName || !botToken || !prefix) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const botId = uuidv4();
    const botDir = path.join(__dirname, 'generated-bots', botId);
    
    await fs.ensureDir(botDir);
    
    // Generate bot files based on template
    await generateBotFiles(template, botName, botToken, prefix, features, botDir);
    
    // Create zip file
    const zipPath = path.join(__dirname, 'downloads', `${botId}.zip`);
    await fs.ensureDir(path.dirname(zipPath));
    await createZipArchive(botDir, zipPath);
    
    res.json({
      success: true,
      botId,
      downloadUrl: `/api/download/${botId}`,
      message: 'Bot generated successfully!'
    });
    
  } catch (error) {
    console.error('Error generating bot:', error);
    res.status(500).json({ error: 'Failed to generate bot' });
  }
});

app.post('/api/start-bot', async (req, res) => {
  try {
    const { botId, botToken, prefix } = req.body;
    
    if (!botId || !botToken || !prefix) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const botDir = path.join(__dirname, 'generated-bots', botId);
    
    if (!await fs.pathExists(botDir)) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Start the bot process
    const botProcess = spawn('node', ['index.js'], {
      cwd: botDir,
      env: { ...process.env, BOT_TOKEN: botToken, PREFIX: prefix }
    });

    activeBots.set(botId, {
      process: botProcess,
      startTime: new Date(),
      status: 'running'
    });

    botProcess.stdout.on('data', (data) => {
      console.log(`Bot ${botId}: ${data}`);
    });

    botProcess.stderr.on('data', (data) => {
      console.error(`Bot ${botId} error: ${data}`);
    });

    botProcess.on('close', (code) => {
      console.log(`Bot ${botId} exited with code ${code}`);
      activeBots.delete(botId);
    });

    res.json({
      success: true,
      message: 'Bot started successfully!',
      botId
    });
    
  } catch (error) {
    console.error('Error starting bot:', error);
    res.status(500).json({ error: 'Failed to start bot' });
  }
});

app.post('/api/stop-bot', async (req, res) => {
  try {
    const { botId } = req.body;
    
    const bot = activeBots.get(botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not running' });
    }

    bot.process.kill();
    activeBots.delete(botId);
    
    res.json({
      success: true,
      message: 'Bot stopped successfully!'
    });
    
  } catch (error) {
    console.error('Error stopping bot:', error);
    res.status(500).json({ error: 'Failed to stop bot' });
  }
});

app.get('/api/bots/status', (req, res) => {
  const botStatuses = Array.from(activeBots.entries()).map(([botId, bot]) => ({
    botId,
    status: bot.status,
    startTime: bot.startTime
  }));
  
  res.json(botStatuses);
});

app.get('/api/download/:botId', (req, res) => {
  const { botId } = req.params;
  const zipPath = path.join(__dirname, 'downloads', `${botId}.zip`);
  
  if (!fs.existsSync(zipPath)) {
    return res.status(404).json({ error: 'Download not found' });
  }
  
  res.download(zipPath, `discord-bot-${botId}.zip`);
});

// Helper functions
async function generateBotFiles(template, botName, botToken, prefix, features, botDir) {
  const templateData = botTemplates[template];
  
  // Generate package.json
  const packageJson = {
    name: botName.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    description: `${botName} - Generated by Discord Bot Maker`,
    main: "index.js",
    scripts: {
      start: "node index.js"
    },
    dependencies: {
      "discord.js": "^14.14.1",
      "dotenv": "^16.3.1"
    }
  };
  
  await fs.writeJson(path.join(botDir, 'package.json'), packageJson, { spaces: 2 });
  
  // Generate main bot file
  const mainBotCode = generateMainBotCode(template, botName, prefix, features);
  await fs.writeFile(path.join(botDir, 'index.js'), mainBotCode);
  
  // Generate commands directory and files
  const commandsDir = path.join(botDir, 'commands');
  await fs.ensureDir(commandsDir);
  
  const commands = generateCommands(template, features);
  for (const [commandName, commandCode] of Object.entries(commands)) {
    await fs.writeFile(path.join(commandsDir, `${commandName}.js`), commandCode);
  }
  
  // Generate config file
  const configCode = generateConfigCode(botName, prefix);
  await fs.writeFile(path.join(botDir, 'config.js'), configCode);
  
  // Generate README
  const readmeContent = generateReadme(botName, templateData);
  await fs.writeFile(path.join(botDir, 'README.md'), readmeContent);
}

function generateMainBotCode(template, botName, prefix, features) {
  return `const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

client.commands = new Collection();
client.prefix = '${prefix}';

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.name, command);
}

// Event handlers
client.once('ready', () => {
  console.log(\`✅ \${client.user.tag} is online!\`);
  console.log(\`🤖 Bot Name: ${botName}\`);
  console.log(\`🎯 Prefix: ${prefix}\`);
  console.log(\`📊 Serving \${client.guilds.cache.size} guilds\`);
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(client.prefix) || message.author.bot) return;

  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || 
                  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!');
  }
});

// Error handling
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Login
client.login(process.env.BOT_TOKEN);
`;
}

function generateCommands(template, features) {
  const commands = {};
  
  switch (template) {
    case 'moderation':
      commands.kick = generateKickCommand();
      commands.ban = generateBanCommand();
      commands.mute = generateMuteCommand();
      commands.warn = generateWarnCommand();
      commands.clear = generateClearCommand();
      break;
    case 'fun':
      commands.eightball = generateEightBallCommand();
      commands.meme = generateMemeCommand();
      commands.joke = generateJokeCommand();
      commands.coinflip = generateCoinFlipCommand();
      break;
    case 'modmail':
      commands.ticket = generateTicketCommand();
      commands.close = generateCloseCommand();
      commands.reply = generateReplyCommand();
      break;
    case 'music':
      commands.play = generatePlayCommand();
      commands.skip = generateSkipCommand();
      commands.queue = generateQueueCommand();
      break;
    case 'utility':
      commands.ping = generatePingCommand();
      commands.serverinfo = generateServerInfoCommand();
      commands.userinfo = generateUserInfoCommand();
      break;
  }
  
  return commands;
}

function generateKickCommand() {
  return `module.exports = {
  name: 'kick',
  description: 'Kick a user from the server',
  async execute(message, args, client) {
    if (!message.member.permissions.has('KickMembers')) {
      return message.reply('❌ You do not have permission to kick members!');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('❌ Please mention a user to kick!');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await message.guild.members.kick(user, reason);
      message.reply(\`✅ Successfully kicked \${user.tag} for: \${reason}\`);
    } catch (error) {
      message.reply('❌ Failed to kick the user. Make sure I have the proper permissions!');
    }
  }
};`;
}

function generateBanCommand() {
  return `module.exports = {
  name: 'ban',
  description: 'Ban a user from the server',
  async execute(message, args, client) {
    if (!message.member.permissions.has('BanMembers')) {
      return message.reply('❌ You do not have permission to ban members!');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('❌ Please mention a user to ban!');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    try {
      await message.guild.members.ban(user, { reason });
      message.reply(\`✅ Successfully banned \${user.tag} for: \${reason}\`);
    } catch (error) {
      message.reply('❌ Failed to ban the user. Make sure I have the proper permissions!');
    }
  }
};`;
}

function generateEightBallCommand() {
  return `module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question',
  async execute(message, args, client) {
    if (!args.length) {
      return message.reply('❌ Please ask a question!');
    }

    const responses = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes - definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      'Don\'t count on it.',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.'
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    message.reply(\`🎱 **\${response}**\`);
  }
};`;
}

function generatePingCommand() {
  return `module.exports = {
  name: 'ping',
  description: 'Check bot latency',
  async execute(message, args, client) {
    const reply = await message.reply('🏓 Pinging...');
    const ping = reply.createdTimestamp - message.createdTimestamp;
    
    reply.edit(\`🏓 Pong! Latency: \${ping}ms | API Latency: \${Math.round(client.ws.ping)}ms\`);
  }
};`;
}

function generateMuteCommand() {
  return `module.exports = {
  name: 'mute',
  description: 'Mute a user',
  async execute(message, args, client) {
    if (!message.member.permissions.has('ModerateMembers')) {
      return message.reply('❌ You do not have permission to mute members!');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('❌ Please mention a user to mute!');
    }

    const duration = parseInt(args[1]) || 5;
    const reason = args.slice(2).join(' ') || 'No reason provided';

    try {
      const member = await message.guild.members.fetch(user.id);
      await member.timeout(duration * 60 * 1000, reason);
      message.reply(\`✅ Successfully muted \${user.tag} for \${duration} minutes\`);
    } catch (error) {
      message.reply('❌ Failed to mute the user!');
    }
  }
};`;
}

function generateWarnCommand() {
  return `module.exports = {
  name: 'warn',
  description: 'Warn a user',
  async execute(message, args, client) {
    if (!message.member.permissions.has('ModerateMembers')) {
      return message.reply('❌ You do not have permission to warn members!');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('❌ Please mention a user to warn!');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    message.reply(\`⚠️ **Warning issued to \${user.tag}**\n**Reason:** \${reason}\`);
  }
};`;
}

function generateClearCommand() {
  return `module.exports = {
  name: 'clear',
  description: 'Clear messages from a channel',
  async execute(message, args, client) {
    if (!message.member.permissions.has('ManageMessages')) {
      return message.reply('❌ You do not have permission to delete messages!');
    }

    const amount = parseInt(args[0]) || 10;
    if (amount < 1 || amount > 100) {
      return message.reply('❌ Please specify a number between 1 and 100!');
    }

    try {
      await message.channel.bulkDelete(amount);
      message.reply(\`✅ Deleted \${amount} messages!\`).then(msg => {
        setTimeout(() => msg.delete(), 3000);
      });
    } catch (error) {
      message.reply('❌ Failed to delete messages!');
    }
  }
};`;
}

function generateMemeCommand() {
  return `module.exports = {
  name: 'meme',
  description: 'Get a random meme',
  async execute(message, args, client) {
    const memes = [
      '😂 Why did the programmer quit his job? Because he didn\'t get arrays!',
      '🤖 What do you call a computer that sings? A Dell!',
      '💻 Why do programmers prefer dark mode? Because light attracts bugs!',
      '🎮 What\'s a programmer\'s favorite drink? Java!',
      '🐛 How many programmers does it take to change a light bulb? None, that\'s a hardware problem!'
    ];
    
    const meme = memes[Math.floor(Math.random() * memes.length)];
    message.reply(\`🎭 **\${meme}**\`);
  }
};`;
}

function generateJokeCommand() {
  return `module.exports = {
  name: 'joke',
  description: 'Tell a random joke',
  async execute(message, args, client) {
    const jokes = [
      'Why don\'t scientists trust atoms? Because they make up everything!',
      'What do you call a fake noodle? An impasta!',
      'Why did the scarecrow win an award? He was outstanding in his field!',
      'Why don\'t eggs tell jokes? They\'d crack each other up!',
      'What do you call a bear with no teeth? A gummy bear!'
    ];
    
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    message.reply(\`😄 **\${joke}**\`);
  }
};`;
}

function generateCoinFlipCommand() {
  return `module.exports = {
  name: 'coinflip',
  description: 'Flip a coin',
  async execute(message, args, client) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    message.reply(\`🪙 **\${result}**\`);
  }
};`;
}

function generateTicketCommand() {
  return `module.exports = {
  name: 'ticket',
  description: 'Create a support ticket',
  async execute(message, args, client) {
    const channel = await message.guild.channels.create({
      name: \`ticket-\${message.author.username}\`,
      type: 0,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['ViewChannel']
        },
        {
          id: message.author.id,
          allow: ['ViewChannel', 'SendMessages']
        }
      ]
    });
    
    message.reply(\`✅ Ticket created! Check \${channel}\`);
  }
};`;
}

function generateCloseCommand() {
  return `module.exports = {
  name: 'close',
  description: 'Close a ticket',
  async execute(message, args, client) {
    if (!message.channel.name.startsWith('ticket-')) {
      return message.reply('❌ This command can only be used in ticket channels!');
    }
    
    message.reply('🔒 This ticket will be closed in 5 seconds...');
    setTimeout(() => {
      message.channel.delete();
    }, 5000);
  }
};`;
}

function generateReplyCommand() {
  return `module.exports = {
  name: 'reply',
  description: 'Reply to a ticket',
  async execute(message, args, client) {
    if (!message.channel.name.startsWith('ticket-')) {
      return message.reply('❌ This command can only be used in ticket channels!');
    }
    
    const reply = args.join(' ');
    if (!reply) {
      return message.reply('❌ Please provide a reply message!');
    }
    
    message.reply(\`📝 **Staff Reply:** \${reply}\`);
  }
};`;
}

function generatePlayCommand() {
  return `module.exports = {
  name: 'play',
  description: 'Play a song (placeholder)',
  async execute(message, args, client) {
    const song = args.join(' ');
    if (!song) {
      return message.reply('❌ Please specify a song to play!');
    }
    
    message.reply(\`🎵 **Now playing:** \${song}\\n*Note: This is a placeholder. Install a music library for full functionality.*\`);
  }
};`;
}

function generateSkipCommand() {
  return `module.exports = {
  name: 'skip',
  description: 'Skip the current song',
  async execute(message, args, client) {
    message.reply('⏭️ **Skipped!**\\n*Note: This is a placeholder. Install a music library for full functionality.*');
  }
};`;
}

function generateQueueCommand() {
  return `module.exports = {
  name: 'queue',
  description: 'Show the music queue',
  async execute(message, args, client) {
    message.reply('📋 **Music Queue:**\\n*Note: This is a placeholder. Install a music library for full functionality.*');
  }
};`;
}

function generateServerInfoCommand() {
  return `module.exports = {
  name: 'serverinfo',
  description: 'Display server information',
  async execute(message, args, client) {
    const guild = message.guild;
    const embed = {
      color: 0x0099ff,
      title: guild.name,
      thumbnail: { url: guild.iconURL() },
      fields: [
        { name: '👑 Owner', value: \`<@\${guild.ownerId}>\`, inline: true },
        { name: '👥 Members', value: guild.memberCount.toString(), inline: true },
        { name: '📅 Created', value: guild.createdAt.toDateString(), inline: true },
        { name: '🎭 Roles', value: guild.roles.cache.size.toString(), inline: true },
        { name: '💬 Channels', value: guild.channels.cache.size.toString(), inline: true },
        { name: '😀 Emojis', value: guild.emojis.cache.size.toString(), inline: true }
      ],
      timestamp: new Date()
    };
    
    message.reply({ embeds: [embed] });
  }
};`;
}

function generateUserInfoCommand() {
  return `module.exports = {
  name: 'userinfo',
  description: 'Display user information',
  async execute(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);
    
    const embed = {
      color: 0x0099ff,
      title: user.tag,
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '📅 Created', value: user.createdAt.toDateString(), inline: true },
        { name: '📥 Joined', value: member.joinedAt.toDateString(), inline: true },
        { name: '🎭 Roles', value: member.roles.cache.size.toString(), inline: true },
        { name: '🎨 Color', value: member.displayHexColor, inline: true },
        { name: '📊 Status', value: member.presence?.status || 'offline', inline: true }
      ],
      timestamp: new Date()
    };
    
    message.reply({ embeds: [embed] });
  }
};`;
}

function generateConfigCode(botName, prefix) {
  return `module.exports = {
  botName: '${botName}',
  prefix: '${prefix}',
  embedColor: '#0099ff',
  defaultCooldown: 3
};`;
}

function generateReadme(botName, templateData) {
  return `# ${botName}

${templateData.description}

## Features
${templateData.features.map(feature => `- ${feature}`).join('\n')}

## Commands
${templateData.commands.map(cmd => `- \`${cmd}\``).join('\n')}

## Setup
1. Install dependencies: \`npm install\`
2. Set your bot token in the environment variables
3. Run the bot: \`npm start\`

## Environment Variables
- \`BOT_TOKEN\`: Your Discord bot token

Generated by Discord Bot Maker
`;
}

async function createZipArchive(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Discord Bot Maker API running on port ${PORT}`);
}); 