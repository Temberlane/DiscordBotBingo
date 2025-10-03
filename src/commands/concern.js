const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('concern')
        .setDescription('Create a concern meme by replying to a message with !concern'),

    async execute(interaction) {
        // This command should be used as a message command, not slash command
        await interaction.reply({
            content: '❌ This command should be used by replying to a message with `!concern`',
            ephemeral: true
        });
    },

    // Handle the message-based concern command
    async handleConcernMessage(message) {
        try {
            // Check if this is a reply to another message
            if (!message.reference || !message.reference.messageId) {
                await message.reply('❌ Please reply to a message with `!concern` to create the meme!');
                return;
            }

            // Fetch the referenced message
            const referencedMessage = await message.channel.messages.fetch(message.reference.messageId);
            
            if (!referencedMessage) {
                await message.reply('❌ Could not find the referenced message!');
                return;
            }

            // Create the concern meme
            const concernImage = await this.createConcernMeme(referencedMessage);
            
            if (concernImage) {
                const attachment = new AttachmentBuilder(concernImage, { name: 'concern.png' });
                await message.reply({ 
                    content: '', 
                    files: [attachment] 
                });
            } else {
                await message.reply('❌ Failed to create the concern meme. Please try again.');
            }

        } catch (error) {
            console.error('Error in concern command:', error);
            await message.reply('❌ An error occurred while creating the concern meme.');
        }
    },

    async createConcernMeme(referencedMessage) {
        try {
            // Canvas dimensions
            const canvasWidth = 315;
            const canvasHeight = 460;
            
            // Create a new Jimp image with transparent background
            const image = new Jimp(canvasWidth, canvasHeight, 0x00000000); // Transparent background
            
            // Load the concern image
            const concernImagePath = path.join(__dirname, '../images/concern.png');
            let concernImage;
            
            try {
                concernImage = await Jimp.read(concernImagePath);
                // Resize concern image to fit
                concernImage.resize(315, 315);
                // Composite the concern image at the top
                image.composite(concernImage, 0, 0);
            } catch (error) {
                console.error('Error loading concern.png:', error);
                // Create a simple placeholder
                const placeholder = new Jimp(100, 100, 0xff6b6bff);
                image.composite(placeholder, 50, 50);
            }

            // Discord-style message layout
            const messageY = 355; // Start position for message
            const avatarSize = 40;
            const avatarX = 20;
            const avatarY = messageY;
            const contentX = avatarX + avatarSize + 12;
            const contentWidth = canvasWidth - contentX - 20;
            
            // Draw user avatar (circular)
            try {
                const avatarUrl = referencedMessage.author.displayAvatarURL({ extension: 'png', size: 64 });
                const avatarImage = await Jimp.read(avatarUrl);
                
                // Resize avatar
                avatarImage.resize(avatarSize, avatarSize);
                
                // Create circular mask
                const mask = new Jimp(avatarSize, avatarSize, 0x00000000);
                mask.circle();
                
                // Apply mask to avatar
                avatarImage.mask(mask);
                
                // Composite avatar
                image.composite(avatarImage, avatarX, avatarY);
            } catch (error) {
                console.error('Error loading avatar:', error);
                // Draw placeholder avatar
                const placeholderAvatar = new Jimp(avatarSize, avatarSize, 0x4a90e2ff);
                placeholderAvatar.circle();
                image.composite(placeholderAvatar, avatarX, avatarY);
            }

            // Get message data
            const username = referencedMessage.author.displayName || referencedMessage.author.username;
            const timestamp = referencedMessage.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageText = referencedMessage.content || '*No text content*';
            
            // Load fonts
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const usernameFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            const timestampFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            
            // Draw username (yellow)
            image.print(usernameFont, contentX, avatarY + 16, {
                text: username,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_TOP
            });
            
            // Draw timestamp (gray)
            const usernameWidth = Jimp.measureText(usernameFont, username);
            image.print(timestampFont, contentX + usernameWidth + 8, avatarY + 16, {
                text: ` — ${timestamp}`,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_TOP
            });

            // Draw message content (light gray)
            const lineHeight = 18;
            const maxLines = Math.floor((canvasHeight - messageY - 60) / lineHeight);
            
            // Wrap text
            const lines = this.wrapTextJimp(messageText, contentWidth, font);
            const displayLines = lines.slice(0, maxLines);
            
            for (let i = 0; i < displayLines.length; i++) {
                image.print(font, contentX, avatarY + 40 + (i * lineHeight), {
                    text: displayLines[i],
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_TOP
                });
            }
            
            if (lines.length > maxLines) {
                image.print(font, contentX, avatarY + 40 + (maxLines * lineHeight), {
                    text: '...',
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_TOP
                });
            }
            
            // Convert to buffer
            return await image.getBufferAsync(Jimp.MIME_PNG);

        } catch (error) {
            console.error('Error creating concern meme:', error);
            return null;
        }
    },

    wrapTextJimp(text, maxWidth, font) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = Jimp.measureText(font, currentLine + ' ' + word);
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }
};