module.exports = {
    // Bot configuration
    bot: {
        name: process.env.BOT_NAME || 'DiscordBotBingo',
        prefix: process.env.PREFIX || '!',
        status: 'online',
        activity: {
            name: 'images | /help',
            type: 'WATCHING'
        }
    },

    // Image processing settings
    imageProcessing: {
        maxFileSize: 8 * 1024 * 1024, // 8MB
        supportedFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        tempDir: 'temp',
        defaultThumbnailSize: { width: 200, height: 200 },
        quality: {
            thumbnail: 80,
            processed: 90
        }
    },

    // Discord API settings
    discord: {
        intents: [
            'Guilds',
            'GuildMessages',
            'MessageContent',
            'GuildMembers'
        ]
    },

    // Error messages
    messages: {
        error: {
            generic: '❌ An error occurred while processing your request.',
            invalidImage: '❌ Invalid image URL or unsupported format.',
            fileTooLarge: '❌ Image file is too large. Maximum size is 8MB.',
            processingFailed: '❌ Failed to process the image. Please try again.',
            commandNotFound: '❌ Command not found. Use `/help` to see available commands.'
        },
        success: {
            imageProcessed: '✅ Image processed successfully!',
            commandExecuted: '✅ Command executed successfully!'
        }
    }
};

