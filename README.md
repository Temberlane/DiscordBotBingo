# Discord Bot Bingo - Image Processing Bot

A powerful Discord bot with comprehensive image processing capabilities built with Discord.js and Sharp.

## Features

🖼️ **Image Processing Commands**
- Create thumbnails with custom dimensions
- Apply various filters (grayscale, sepia, vintage, blur, sharpen)
- Resize images with different fit options
- Add text overlays to images
- Convert between different image formats (JPEG, PNG, WebP)
- Get detailed image information

🤖 **Discord Integration**
- Slash commands for easy interaction
- Automatic thumbnail generation for uploaded images
- Comprehensive help system
- Error handling and user feedback

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DiscordBotBingo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Discord bot credentials:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   CLIENT_ID=your_discord_application_id_here
   GUILD_ID=your_discord_server_id_here
   PREFIX=!
   BOT_NAME=DiscordBotBingo
   ```

4. **Deploy slash commands**
   ```bash
   npm run deploy
   ```

5. **Start the bot**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Copy the bot token to your `.env` file
5. Go to the "OAuth2" > "URL Generator" section
6. Select "bot" and "applications.commands" scopes
7. Select necessary permissions (Send Messages, Use Slash Commands, Attach Files)
8. Use the generated URL to invite the bot to your server

## Usage

### Slash Commands

- `/help` - Get help with all available commands
- `/image thumbnail <url> [width] [height]` - Create a thumbnail
- `/image filter <url> <type>` - Apply image filters
- `/image resize <url> <width> <height> [fit]` - Resize images
- `/image text <url> <text> [x] [y]` - Add text overlay
- `/image convert <url> <format>` - Convert image format
- `/image info <url>` - Get image information

### Automatic Processing

Simply upload an image to any channel and the bot will automatically create a thumbnail!

## Available Filters

- **Grayscale** - Convert to black and white
- **Sepia** - Apply vintage sepia tone
- **Vintage** - Apply vintage effect with reduced saturation
- **Blur** - Apply blur effect
- **Sharpen** - Enhance image sharpness

## Resize Options

- **Cover** - Resize to cover the entire area (may crop)
- **Contain** - Resize to fit within the area (no cropping)
- **Fill** - Stretch to fill the area (may distort)
- **Inside** - Resize to fit inside the area
- **Outside** - Resize to cover the area

## Supported Formats

- **Input**: JPEG, PNG, GIF, WebP
- **Output**: JPEG, PNG, WebP

## Technical Details

### Dependencies

- **discord.js** - Discord API wrapper
- **sharp** - High-performance image processing
- **jimp** - JavaScript image manipulation
- **canvas** - Canvas API for Node.js
- **dotenv** - Environment variable management

### File Structure

```
src/
├── commands/          # Slash command definitions
│   ├── image.js      # Main image processing commands
│   └── help.js       # Help command
├── utils/            # Utility functions
│   └── imageProcessor.js  # Image processing logic
├── config/           # Configuration files
│   └── bot.js        # Bot configuration
├── deploy-commands.js # Command deployment script
└── index.js          # Main bot file
```

## Development

### Adding New Commands

1. Create a new file in `src/commands/`
2. Export an object with `data` and `execute` properties
3. Run `npm run deploy` to register the command
4. Restart the bot

### Adding New Image Effects

1. Add the effect logic to `ImageProcessor` class in `src/utils/imageProcessor.js`
2. Add the command option in `src/commands/image.js`
3. Deploy and test

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
A discord bot that allows you react with a dog picture in a funny way. 
