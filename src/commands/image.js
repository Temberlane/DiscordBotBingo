const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Process images with various effects')
        .addSubcommand(subcommand =>
            subcommand
                .setName('thumbnail')
                .setDescription('Create a thumbnail of an image')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('URL of the image to process')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('width')
                        .setDescription('Thumbnail width (default: 200)')
                        .setMinValue(50)
                        .setMaxValue(1000)
                )
                .addIntegerOption(option =>
                    option
                        .setName('height')
                        .setDescription('Thumbnail height (default: 200)')
                        .setMinValue(50)
                        .setMaxValue(1000)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('filter')
                .setDescription('Apply a filter to an image')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('URL of the image to process')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('type')
                        .setDescription('Type of filter to apply')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Grayscale', value: 'grayscale' },
                            { name: 'Sepia', value: 'sepia' },
                            { name: 'Vintage', value: 'vintage' },
                            { name: 'Blur', value: 'blur' },
                            { name: 'Sharpen', value: 'sharpen' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('resize')
                .setDescription('Resize an image')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('URL of the image to process')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('width')
                        .setDescription('New width')
                        .setRequired(true)
                        .setMinValue(50)
                        .setMaxValue(4000)
                )
                .addIntegerOption(option =>
                    option
                        .setName('height')
                        .setDescription('New height')
                        .setRequired(true)
                        .setMinValue(50)
                        .setMaxValue(4000)
                )
                .addStringOption(option =>
                    option
                        .setName('fit')
                        .setDescription('How to fit the image')
                        .addChoices(
                            { name: 'Cover', value: 'cover' },
                            { name: 'Contain', value: 'contain' },
                            { name: 'Fill', value: 'fill' },
                            { name: 'Inside', value: 'inside' },
                            { name: 'Outside', value: 'outside' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('text')
                .setDescription('Add text overlay to an image')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('URL of the image to process')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('text')
                        .setDescription('Text to overlay')
                        .setRequired(true)
                        .setMaxLength(100)
                )
                .addIntegerOption(option =>
                    option
                        .setName('x')
                        .setDescription('X position (default: 10)')
                        .setMinValue(0)
                        .setMaxValue(1000)
                )
                .addIntegerOption(option =>
                    option
                        .setName('y')
                        .setDescription('Y position (default: 10)')
                        .setMinValue(0)
                        .setMaxValue(1000)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('convert')
                .setDescription('Convert image to different format')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('URL of the image to process')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('format')
                        .setDescription('Target format')
                        .setRequired(true)
                        .addChoices(
                            { name: 'JPEG', value: 'jpeg' },
                            { name: 'PNG', value: 'png' },
                            { name: 'WebP', value: 'webp' }
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Get information about an image')
                .addStringOption(option =>
                    option
                        .setName('url')
                        .setDescription('URL of the image to analyze')
                        .setRequired(true)
                )
        ),

    async execute(interaction, imageProcessor) {
        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand();

        try {
            let result;
            let filename = 'processed_image';

            switch (subcommand) {
                case 'thumbnail': {
                    const url = interaction.options.getString('url');
                    const width = interaction.options.getInteger('width') || 200;
                    const height = interaction.options.getInteger('height') || 200;
                    
                    result = await imageProcessor.createThumbnail(url, width, height);
                    filename = `thumbnail_${width}x${height}.jpg`;
                    break;
                }

                case 'filter': {
                    const url = interaction.options.getString('url');
                    const filterType = interaction.options.getString('type');
                    
                    result = await imageProcessor.applyFilter(url, filterType);
                    filename = `filtered_${filterType}.jpg`;
                    break;
                }

                case 'resize': {
                    const url = interaction.options.getString('url');
                    const width = interaction.options.getInteger('width');
                    const height = interaction.options.getInteger('height');
                    const fit = interaction.options.getString('fit') || 'cover';
                    
                    result = await imageProcessor.resizeImage(url, width, height, fit);
                    filename = `resized_${width}x${height}.jpg`;
                    break;
                }

                case 'text': {
                    const url = interaction.options.getString('url');
                    const text = interaction.options.getString('text');
                    const x = interaction.options.getInteger('x') || 10;
                    const y = interaction.options.getInteger('y') || 10;
                    
                    result = await imageProcessor.addTextOverlay(url, text, { x, y });
                    filename = 'text_overlay.jpg';
                    break;
                }

                case 'convert': {
                    const url = interaction.options.getString('url');
                    const format = interaction.options.getString('format');
                    
                    result = await imageProcessor.convertFormat(url, format);
                    filename = `converted.${format}`;
                    break;
                }

                case 'info': {
                    const url = interaction.options.getString('url');
                    const info = await imageProcessor.getImageInfo(url);
                    
                    if (info) {
                        const embed = {
                            title: '📊 Image Information',
                            color: 0x0099FF,
                            fields: [
                                { name: 'Width', value: `${info.width}px`, inline: true },
                                { name: 'Height', value: `${info.height}px`, inline: true },
                                { name: 'Format', value: info.format.toUpperCase(), inline: true },
                                { name: 'Size', value: `${(info.size / 1024).toFixed(2)} KB`, inline: true },
                                { name: 'Channels', value: info.channels.toString(), inline: true },
                                { name: 'Density', value: info.density ? `${info.density} DPI` : 'N/A', inline: true }
                            ],
                            timestamp: new Date().toISOString()
                        };

                        await interaction.editReply({ embeds: [embed] });
                        return;
                    } else {
                        await interaction.editReply('❌ Failed to get image information.');
                        return;
                    }
                }
            }

            if (result) {
                const attachment = new AttachmentBuilder(result, { name: filename });
                await interaction.editReply({ 
                    content: `✅ Image processed successfully!`,
                    files: [attachment] 
                });
            } else {
                await interaction.editReply('❌ Failed to process the image. Please check the URL and try again.');
            }

        } catch (error) {
            console.error('Error in image command:', error);
            await interaction.editReply('❌ An error occurred while processing the image.');
        }
    },
};

