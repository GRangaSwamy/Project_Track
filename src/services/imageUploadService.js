/**
 * CLOUDINARY IMAGE UPLOAD SERVICE
 * 
 * Handles image uploads to Cloudinary using UNSIGNED upload preset
 * Cloud Name: dqis32szu
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; // Unsigned upload preset

/**
 * Upload image to Cloudinary (UNSIGNED)
 * @param {File} file - Image file to upload
 * @returns {Promise} Upload result with secure_url
 */
export const uploadImageToCloudinary = async (file) => {
    try {
        // Validate file
        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return { success: false, error: 'Invalid file type. Please upload JPG, PNG, or WebP.' };
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return { success: false, error: 'File too large. Maximum size is 5MB.' };
        }

        // Create form data - UNSIGNED upload (no api_key, no signature)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'hl-constructions/projects');

        console.log('📤 Uploading to Cloudinary...');

        // Upload to Cloudinary
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Cloudinary upload error:', errorData);

            // Handle specific errors
            if (response.status === 401) {
                return {
                    success: false,
                    error: 'Upload preset not configured. Please check CLOUDINARY_UPLOAD_PRESET.'
                };
            }

            return {
                success: false,
                error: errorData.error?.message || 'Upload failed. Please try again.'
            };
        }

        const data = await response.json();

        console.log('✅ Image uploaded successfully:', data.secure_url);

        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
        };
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        return {
            success: false,
            error: 'Network error. Please check your internet connection and try again.'
        };
    }
};

/**
 * Compress image before upload
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width (default: 1920)
 * @param {number} quality - Quality 0-1 (default: 0.85)
 * @returns {Promise<File>} Compressed file
 */
export const compressImage = async (file, maxWidth = 1920, quality = 0.85) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
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
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = reject;
            img.src = e.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Get optimized image URL from Cloudinary
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, options = {}) => {
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }

    const {
        width = 1920,
        height = 600,
        quality = 'auto',
        format = 'auto',
    } = options;

    // Insert transformations into Cloudinary URL
    const transformations = `w_${width},h_${height},c_limit,q_${quality},f_${format}`;

    return url.replace('/upload/', `/upload/${transformations}/`);
};

export default {
    uploadImageToCloudinary,
    compressImage,
    getOptimizedImageUrl,
};
