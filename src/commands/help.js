const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help with bot commands'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 Discord Bot Bingo - Help')
            .setDescription('Here are all the available commands for image processing!')
            .setColor(0x0099FF)
            .addFields(
                {
                    name: '🖼️ Image Processing Commands',
                    value: '`/image` - Main image processing command with subcommands:',
                    inline: false
                },
                {
                    name: '📸 Thumbnail',
                    value: '`/image thumbnail <url> [width] [height]`\nCreate a thumbnail of an image',
                    inline: true
                },
                {
                    name: '🎨 Filter',
                    value: '`/image filter <url> <type>`\nApply filters: grayscale, sepia, vintage, blur, sharpen',
                    inline: true
                },
                {
                    name: '📏 Resize',
                    value: '`/image resize <url> <width> <height> [fit]`\nResize images with different fit options',
                    inline: true
                },
                {
                    name: '📝 Text Overlay',
                    value: '`/image text <url> <text> [x] [y]`\nAdd text overlay to images',
                    inline: true
                },
                {
                    name: '🔄 Convert',
                    value: '`/image convert <url> <format>`\nConvert between JPEG, PNG, and WebP',
                    inline: true
                },
                {
                    name: '📊 Image Info',
                    value: '`/image info <url>`\nGet detailed information about an image',
                    inline: true
                },
                {
                    name: '😟 Concern Meme',
                    value: '`!concern` (reply to a message)\nCreate a concern meme with the concerned face looking at a message',
                    inline: true
                },
                {
                    name: '💡 Tips',
                    value: '• You can also upload images directly - the bot will automatically create thumbnails!\n• All processed images are optimized for Discord\n• Maximum image size: 8MB\n• Use `!concern` by replying to any message to create a funny meme!',
                    inline: false
                }
            )
            .setFooter({ text: 'Discord Bot Bingo - Image Processing Bot' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

