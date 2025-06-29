# Discord Bot Maker

A comprehensive Discord Bot Maker with both web and desktop applications. Create, customize, and deploy Discord bots with ease using pre-built templates.

## Features

### 🤖 Bot Templates
- **Moderation Bot**: Kick, ban, mute, warn, and clear commands
- **Fun Bot**: Games, memes, jokes, and interactive commands
- **Modmail Bot**: Private messaging system for support
- **Music Bot**: Music playback with playlist support
- **Utility Bot**: Server info, user info, and utility commands

### 🌐 Web Application
- Modern React-based interface
- Real-time bot generation
- Live bot management
- Beautiful, responsive design
- Template browsing and selection

### 🖥️ Desktop Application
- Electron-based desktop app
- Native system integration
- Offline capability
- Cross-platform support

### ⚡ Live Bot Management
- Start/stop bots directly from the interface
- Real-time status monitoring
- Bot uptime tracking
- Process management

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Discord Bot Token (from Discord Developer Portal)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd discord-bot-maker
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend API server on `http://localhost:5000`
- Web application on `http://localhost:3000`

### Desktop Application

To run the desktop app in development mode:
```bash
cd desktop
npm start -- --dev
```

## Usage

### Creating a Bot

1. **Get a Discord Bot Token**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section
   - Copy your bot token

2. **Choose a Template**
   - Browse available templates
   - Select the one that fits your needs
   - Review features and commands

3. **Configure Your Bot**
   - Enter bot name and token
   - Set command prefix
   - Customize features

4. **Generate and Deploy**
   - Generate bot files
   - Download the ZIP file
   - Extract and run the bot

### Bot Management

- **Start Bots**: Launch bots directly from the web interface
- **Monitor Status**: Real-time status and uptime tracking
- **Stop Bots**: Safely stop running bots
- **Download Files**: Get bot source code for customization

## Project Structure

```
discord-bot-maker/
├── backend/                 # Express API server
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── web/                    # React web application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main app component
│   └── package.json       # Web dependencies
├── desktop/               # Electron desktop app
│   ├── main.js           # Main process
│   ├── preload.js        # Preload script
│   └── package.json      # Desktop dependencies
└── package.json          # Root package.json
```

## API Endpoints

### Templates
- `GET /api/templates` - Get available bot templates

### Bot Generation
- `POST /api/generate-bot` - Generate bot files
- `GET /api/download/:botId` - Download generated bot

### Bot Management
- `POST /api/start-bot` - Start a bot
- `POST /api/stop-bot` - Stop a bot
- `GET /api/bots/status` - Get bot status

## Bot Templates

### Moderation Bot
- **Commands**: kick, ban, mute, warn, clear
- **Features**: Permission checking, logging, auto-moderation
- **Use Case**: Server moderation and management

### Fun Bot
- **Commands**: 8ball, meme, joke, coinflip, dice
- **Features**: Random responses, games, entertainment
- **Use Case**: Community engagement and fun

### Modmail Bot
- **Commands**: ticket, close, reply, block
- **Features**: Private messaging, ticket system
- **Use Case**: Support and communication

### Music Bot
- **Commands**: play, skip, queue, volume
- **Features**: Music playback, playlist management
- **Use Case**: Voice channel entertainment

### Utility Bot
- **Commands**: ping, serverinfo, userinfo, avatar
- **Features**: Server information, user details
- **Use Case**: Server utilities and information

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Web Development
```bash
cd web
npm start
```

### Desktop Development
```bash
cd desktop
npm start -- --dev
```

### Building for Production

**Web Application**
```bash
cd web
npm run build
```

**Desktop Application**
```bash
cd desktop
npm run build
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
```

### Discord Bot Setup

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Add a bot to your application
3. Copy the bot token
4. Set up OAuth2 redirect URL
5. Configure bot permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- **Documentation**: Check the README and inline comments
- **Issues**: Report bugs and feature requests on GitHub
- **Discord**: Join our Discord server for support

## Roadmap

- [ ] More bot templates
- [ ] Advanced customization options
- [ ] Bot analytics and metrics
- [ ] Multi-language support
- [ ] Plugin system
- [ ] Cloud deployment options
- [ ] Mobile application

---

**Made with ❤️ for the Discord community** 