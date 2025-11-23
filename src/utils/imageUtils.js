/**
 * Compress an image file using Canvas
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width of the output image
 * @param {number} quality - Quality of the output image (0 to 1)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
        console.log("Starting image compression for:", file.name, "Type:", file.type);

        if (!file.type.startsWith('image/')) {
            console.error("File is not an image:", file.type);
            return reject(new Error('File is not an image'));
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                console.log("Compression successful. Original size:", file.size, "New size:", blob.size);
                                resolve(blob);
                            } else {
                                console.error("Canvas toBlob returned null");
                                reject(new Error('Canvas is empty'));
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                } catch (e) {
                    console.error("Error during canvas operation:", e);
                    reject(e);
                }
            };
            img.onerror = (error) => {
                console.error("Image load error:", error);
                reject(error);
            };
        };
        reader.onerror = (error) => {
            console.error("FileReader error:", error);
            reject(error);
        };
    });
};
