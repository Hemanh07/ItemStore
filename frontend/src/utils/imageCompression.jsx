/* // utils/imageCompression.js
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to blob with compression
            canvas.toBlob(resolve, 'image/jpeg', quality);
        };

        img.src = URL.createObjectURL(file);
    });
};

export const convertToBase64 = (blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
};

export const compressAndConvert = async (file, maxWidth = 800, quality = 0.8) => {
    try {
        const compressedBlob = await compressImage(file, maxWidth, quality);
        const base64 = await convertToBase64(compressedBlob);

        // Get file size info
        const originalSize = (file.size / 1024 / 1024).toFixed(2);
        const compressedSize = (compressedBlob.size / 1024 / 1024).toFixed(2);

        console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`);

        return base64;
    } catch (error) {
        console.error('Error compressing image:', error);
        return null;
    }
}; */

// utils/imageCompression.js
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            try {
                // Calculate new dimensions
                let { width, height } = img;

                // More aggressive resizing for very large images
                const maxDimension = Math.max(width, height);
                if (maxDimension > maxWidth) {
                    const ratio = maxWidth / maxDimension;
                    width *= ratio;
                    height *= ratio;
                }

                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob with compression
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Canvas to blob conversion failed'));
                    }
                }, 'image/jpeg', quality);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => {
            reject(new Error('Image loading failed'));
        };

        img.src = URL.createObjectURL(file);
    });
};

export const convertToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('FileReader failed'));
        reader.readAsDataURL(blob);
    });
};

export const compressAndConvert = async (file, maxWidth = 800, quality = 0.8) => {
    try {
        // Input validation
        if (!file || !file.type.startsWith('image/')) {
            throw new Error('Invalid file type');
        }

        const originalSize = (file.size / 1024 / 1024).toFixed(2);
        console.log(`Original image size: ${originalSize}MB`);

        // Skip compression for very small files
        if (file.size < 100 * 1024) { // Less than 100KB
            console.log('File is small, skipping compression');
            return await convertToBase64(file);
        }

        // Adaptive compression based on file size
        let adaptiveMaxWidth = maxWidth;
        let adaptiveQuality = quality;

        const fileSizeMB = file.size / 1024 / 1024;

        if (fileSizeMB > 10) {
            adaptiveMaxWidth = 600;
            adaptiveQuality = 0.5;
        } else if (fileSizeMB > 5) {
            adaptiveMaxWidth = 700;
            adaptiveQuality = 0.6;
        } else if (fileSizeMB > 2) {
            adaptiveQuality = 0.7;
        }

        const compressedBlob = await compressImage(file, adaptiveMaxWidth, adaptiveQuality);

        // If compressed size is still too large, compress more aggressively
        if (compressedBlob.size > 2 * 1024 * 1024) { // If still > 2MB
            console.log('File still large, applying more aggressive compression');
            const moreCompressedBlob = await compressImage(file, 500, 0.4);
            const base64 = await convertToBase64(moreCompressedBlob);

            const finalSize = (moreCompressedBlob.size / 1024 / 1024).toFixed(2);
            console.log(`Image compressed (aggressive): ${originalSize}MB → ${finalSize}MB`);

            return base64;
        }

        const base64 = await convertToBase64(compressedBlob);

        // Get file size info
        const compressedSize = (compressedBlob.size / 1024 / 1024).toFixed(2);
        console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`);

        return base64;
    } catch (error) {
        console.error('Error compressing image:', error);

        // Fallback: try to return original as base64 if it's not too large
        if (file.size < 5 * 1024 * 1024) { // Less than 5MB
            console.log('Compression failed, using original file');
            try {
                return await convertToBase64(file);
            } catch (fallbackError) {
                console.error('Fallback conversion also failed:', fallbackError);
                return null;
            }
        }

        return null;
    }
};

// Utility function to estimate base64 size
export const estimateBase64Size = (file) => {
    // Base64 encoding increases size by ~33%
    return file.size * 1.33;
};

// Utility function to check if file needs compression
export const needsCompression = (file, maxSizeMB = 2) => {
    const estimatedBase64Size = estimateBase64Size(file);
    return estimatedBase64Size > (maxSizeMB * 1024 * 1024);
};