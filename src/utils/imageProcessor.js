const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

class ImageProcessor {
    constructor() {
        this.tempDir = path.join(__dirname, '../temp');
        this.ensureTempDir();
    }

    ensureTempDir() {
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Create a thumbnail of an image
     * @param {string} imageUrl - URL of the image to process
     * @param {number} width - Thumbnail width (default: 200)
     * @param {number} height - Thumbnail height (default: 200)
     * @returns {Promise<Buffer>} Processed image buffer
     */
    async createThumbnail(imageUrl, width = 200, height = 200) {
        try {
            const response = await fetch(imageUrl);
            const imageBuffer = await response.arrayBuffer();
            
            const processedBuffer = await sharp(Buffer.from(imageBuffer))
                .resize(width, height, { 
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 })
                .toBuffer();

            return processedBuffer;
        } catch (error) {
            console.error('Error creating thumbnail:', error);
            return null;
        }
    }

    /**
     * Apply a filter to an image
     * @param {string} imageUrl - URL of the image to process
     * @param {string} filterType - Type of filter to apply
     * @returns {Promise<Buffer>} Processed image buffer
     */
    async applyFilter(imageUrl, filterType) {
        try {
            const response = await fetch(imageUrl);
            const imageBuffer = await response.arrayBuffer();
            
            let sharpInstance = sharp(Buffer.from(imageBuffer));

            switch (filterType.toLowerCase()) {
                case 'grayscale':
                    sharpInstance = sharpInstance.grayscale();
                    break;
                case 'sepia':
                    sharpInstance = sharpInstance.modulate({
                        saturation: 0.5,
                        hue: 30
                    });
                    break;
                case 'vintage':
                    sharpInstance = sharpInstance.modulate({
                        brightness: 0.8,
                        saturation: 0.7
                    }).sharpen();
                    break;
                case 'blur':
                    sharpInstance = sharpInstance.blur(5);
                    break;
                case 'sharpen':
                    sharpInstance = sharpInstance.sharpen();
                    break;
                default:
                    throw new Error(`Unknown filter type: ${filterType}`);
            }

            const processedBuffer = await sharpInstance
                .jpeg({ quality: 90 })
                .toBuffer();

            return processedBuffer;
        } catch (error) {
            console.error('Error applying filter:', error);
            return null;
        }
    }

    /**
     * Resize an image
     * @param {string} imageUrl - URL of the image to process
     * @param {number} width - New width
     * @param {number} height - New height
     * @param {string} fit - How to fit the image ('cover', 'contain', 'fill', 'inside', 'outside')
     * @returns {Promise<Buffer>} Processed image buffer
     */
    async resizeImage(imageUrl, width, height, fit = 'cover') {
        try {
            const response = await fetch(imageUrl);
            const imageBuffer = await response.arrayBuffer();
            
            const processedBuffer = await sharp(Buffer.from(imageBuffer))
                .resize(width, height, { fit })
                .jpeg({ quality: 90 })
                .toBuffer();

            return processedBuffer;
        } catch (error) {
            console.error('Error resizing image:', error);
            return null;
        }
    }

    /**
     * Add text overlay to an image
     * @param {string} imageUrl - URL of the image to process
     * @param {string} text - Text to overlay
     * @param {Object} options - Text styling options
     * @returns {Promise<Buffer>} Processed image buffer
     */
    async addTextOverlay(imageUrl, text, options = {}) {
        try {
            const response = await fetch(imageUrl);
            const imageBuffer = await response.arrayBuffer();
            
            // Load image with Jimp for text overlay
            const image = await Jimp.read(Buffer.from(imageBuffer));
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            
            const {
                x = 10,
                y = 10,
                fontSize = 32,
                color = '#FFFFFF'
            } = options;

            image.print(font, x, y, text);
            
            return await image.getBufferAsync(Jimp.MIME_JPEG);
        } catch (error) {
            console.error('Error adding text overlay:', error);
            return null;
        }
    }

    /**
     * Create a collage from multiple images
     * @param {Array<string>} imageUrls - Array of image URLs
     * @param {number} cols - Number of columns
     * @param {number} rows - Number of rows
     * @returns {Promise<Buffer>} Processed image buffer
     */
    async createCollage(imageUrls, cols = 2, rows = 2) {
        try {
            const cellWidth = 300;
            const cellHeight = 300;
            const canvasWidth = cellWidth * cols;
            const canvasHeight = cellHeight * rows;

            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext('2d');

            // Fill background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            for (let i = 0; i < Math.min(imageUrls.length, cols * rows); i++) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = col * cellWidth;
                const y = row * cellHeight;

                try {
                    const image = await loadImage(imageUrls[i]);
                    ctx.drawImage(image, x, y, cellWidth, cellHeight);
                } catch (error) {
                    console.error(`Error loading image ${i}:`, error);
                }
            }

            return canvas.toBuffer('image/jpeg');
        } catch (error) {
            console.error('Error creating collage:', error);
            return null;
        }
    }

    /**
     * Convert image to different format
     * @param {string} imageUrl - URL of the image to process
     * @param {string} format - Target format ('jpeg', 'png', 'webp')
     * @returns {Promise<Buffer>} Processed image buffer
     */
    async convertFormat(imageUrl, format) {
        try {
            const response = await fetch(imageUrl);
            const imageBuffer = await response.arrayBuffer();
            
            let sharpInstance = sharp(Buffer.from(imageBuffer));

            switch (format.toLowerCase()) {
                case 'jpeg':
                case 'jpg':
                    return await sharpInstance.jpeg({ quality: 90 }).toBuffer();
                case 'png':
                    return await sharpInstance.png().toBuffer();
                case 'webp':
                    return await sharpInstance.webp({ quality: 90 }).toBuffer();
                default:
                    throw new Error(`Unsupported format: ${format}`);
            }
        } catch (error) {
            console.error('Error converting format:', error);
            return null;
        }
    }

    /**
     * Get image information
     * @param {string} imageUrl - URL of the image to analyze
     * @returns {Promise<Object>} Image metadata
     */
    async getImageInfo(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            const imageBuffer = await response.arrayBuffer();
            
            const metadata = await sharp(Buffer.from(imageBuffer)).metadata();
            
            return {
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                size: metadata.size,
                channels: metadata.channels,
                density: metadata.density
            };
        } catch (error) {
            console.error('Error getting image info:', error);
            return null;
        }
    }

    /**
     * Clean up temporary files
     */
    cleanup() {
        try {
            const files = fs.readdirSync(this.tempDir);
            files.forEach(file => {
                const filePath = path.join(this.tempDir, file);
                fs.unlinkSync(filePath);
            });
        } catch (error) {
            console.error('Error cleaning up temp files:', error);
        }
    }
}

module.exports = ImageProcessor;

