/**
 * CLOUDINARY UPLOAD SERVICE
 * 
 * Handles image uploads to Cloudinary using UNSIGNED upload preset
 * 
 * Cloudinary Config:
 * - Cloud Name: dqis32szu
 * - Upload Preset: daily_logs (MUST be unsigned)
 * - Upload URL: https://api.cloudinary.com/v1_1/dqis32szu/image/upload
 * 
 * IMPORTANT: This uses unsigned upload - NO API secret needed or exposed
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Upload a single image to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise} Cloudinary response with secure_url
 */
export const uploadImageToCloudinary = async (file) => {
    try {
        // Validate file
        if (!file) {
            console.error('❌ No file provided');
            return { success: false, error: 'No file provided' };
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error('❌ File is not an image:', file.type);
            return { success: false, error: 'File must be an image' };
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            console.error('❌ File too large:', file.size);
            return { success: false, error: 'Image size must be less than 10MB' };
        }

        console.log('📤 Uploading image to Cloudinary:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);

        // Create FormData - CORRECT FORMAT
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
        // Optional: organize images in folders
        formData.append('folder', 'construction_tracker');

        // Upload to Cloudinary
        const response = await fetch(CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData,
            // DO NOT set Content-Type header - browser will set it automatically with boundary
        });

        // Get response data
        const data = await response.json();

        // Check if upload failed
        if (!response.ok) {
            console.error('❌ Cloudinary upload error:', {
                status: response.status,
                statusText: response.statusText,
                error: data.error,
                fullResponse: data
            });

            // Provide helpful error messages
            if (response.status === 400) {
                if (data.error?.message?.includes('upload_preset')) {
                    return {
                        success: false,
                        error: `Upload preset "${CLOUDINARY_UPLOAD_PRESET}" not found or not unsigned. Please create it in Cloudinary dashboard.`
                    };
                }
                return {
                    success: false,
                    error: data.error?.message || 'Bad request - check upload preset configuration'
                };
            }

            return {
                success: false,
                error: data.error?.message || `Upload failed (${response.status})`
            };
        }

        console.log('✅ Image uploaded successfully:', data.secure_url);

        return {
            success: true,
            url: data.secure_url,
            publicId: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
            bytes: data.bytes,
        };
    } catch (error) {
        console.error('❌ Error uploading image:', error);
        return {
            success: false,
            error: error.message || 'Upload failed'
        };
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {FileList|Array} files - Array of image files
 * @returns {Promise} Array of upload results with URLs
 */
export const uploadMultipleImages = async (files) => {
    try {
        if (!files || files.length === 0) {
            console.error('❌ No files provided');
            return { success: false, error: 'No files provided' };
        }

        console.log(`📤 Uploading ${files.length} image(s) to Cloudinary...`);

        // Convert FileList to Array if needed
        const fileArray = Array.from(files);

        // Upload all files in parallel
        const uploadPromises = fileArray.map(file => uploadImageToCloudinary(file));
        const results = await Promise.all(uploadPromises);

        // Check if any uploads failed
        const failedUploads = results.filter(r => !r.success);

        if (failedUploads.length > 0) {
            console.error(`❌ ${failedUploads.length} upload(s) failed:`, failedUploads);

            // If all failed, return error
            if (failedUploads.length === results.length) {
                return {
                    success: false,
                    error: `All ${failedUploads.length} upload(s) failed: ${failedUploads[0].error}`,
                    results,
                };
            }

            // Some succeeded, some failed
            const successCount = results.length - failedUploads.length;
            console.warn(`⚠️ ${successCount} succeeded, ${failedUploads.length} failed`);
        }

        // Extract URLs from successful uploads
        const urls = results
            .filter(r => r.success)
            .map(r => r.url);

        console.log(`✅ Successfully uploaded ${urls.length} image(s)`);

        return {
            success: urls.length > 0,
            urls,
            results,
            successCount: urls.length,
            failureCount: failedUploads.length,
        };
    } catch (error) {
        console.error('❌ Error uploading multiple images:', error);
        return {
            success: false,
            error: error.message || 'Upload failed'
        };
    }
};

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'File must be an image' };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'Image size must be less than 10MB' };
    }

    return { valid: true };
};

/**
 * Get Cloudinary configuration info (for debugging)
 */
export const getCloudinaryConfig = () => {
    return {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        uploadUrl: CLOUDINARY_UPLOAD_URL,
    };
};
