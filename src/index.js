const { Client, GatewayIntentBits, Collection, Events, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import image processing utilities
const ImageProcessor = require('./utils/imageProcessor');
const ConcernCommand = require('./commands/concern');

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Create a collection to store commands
client.commands = new Collection();

// Load command files
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️  The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Initialize image processor
const imageProcessor = new ImageProcessor();

// Bot ready event
client.once(Events.ClientReady, readyClient => {
    console.log(`🤖 Bot is ready! Logged in as ${readyClient.user.tag}`);
    console.log(`📊 Serving ${readyClient.guilds.cache.size} guilds`);
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction, imageProcessor);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        
        const errorMessage = {
            content: 'There was an error while executing this command!',
            ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
});

// Handle message events for image processing
client.on(Events.MessageCreate, async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Handle concern command
    if (message.content === '!concern') {
        await ConcernCommand.handleConcernMessage(message);
        return;
    }

    // // Check if message has attachments
    // if (message.attachments.size > 0) {
    //     const attachment = message.attachments.first();
        
    //     // Check if it's an image
    //     if (attachment.contentType && attachment.contentType.startsWith('image/')) {
    //         try {
    //             // Process the image (example: create a thumbnail)
    //             const processedImage = await imageProcessor.createThumbnail(attachment.url);
                
    //             if (processedImage) {
    //                 const attachment = new AttachmentBuilder(processedImage, { name: 'thumbnail.png' });
    //                 await message.reply({ 
    //                     content: '📸 Here\'s a thumbnail of your image!', 
    //                     files: [attachment] 
    //                 });
    //             }
    //         } catch (error) {
    //             console.error('Error processing image:', error);
    //         }
    //     }
    // }
});

// Error handling
client.on('error', error => {
    console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

