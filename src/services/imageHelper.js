/**
 * IMAGE MANAGEMENT HELPER
 * 
 * Helper functions to add images to Phases and Daily Logs
 * Works with Cloudinary URLs
 */

import { updatePhase } from './phaseService';
import { updateDailyLog } from './dailyLogService';

/**
 * Add images to a phase
 * @param {string} projectId - Project ID
 * @param {string} phaseId - Phase ID
 * @param {Array} currentImages - Current phase images
 * @param {Array} newImageUrls - New Cloudinary image URLs to add
 * @returns {Promise} Success status
 */
export const addImagesToPhase = async (projectId, phaseId, currentImages = [], newImageUrls = []) => {
    try {
        // Combine current and new images
        const updatedImages = [...currentImages, ...newImageUrls];

        // Update phase in Firestore
        const result = await updatePhase(projectId, phaseId, {
            images: updatedImages
        });

        if (result.success) {
            console.log(`✅ Added ${newImageUrls.length} image(s) to phase`);
            return { success: true, images: updatedImages };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error adding images to phase:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Add images to a daily log
 * @param {string} projectId - Project ID
 * @param {string} phaseId - Phase ID
 * @param {string} logId - Daily Log ID
 * @param {Array} currentImages - Current log images
 * @param {Array} newImageUrls - New Cloudinary image URLs to add
 * @returns {Promise} Success status
 */
export const addImagesToDailyLog = async (projectId, phaseId, logId, currentImages = [], newImageUrls = []) => {
    try {
        // Combine current and new images
        const updatedImages = [...currentImages, ...newImageUrls];

        // Update daily log in Firestore
        const result = await updateDailyLog(projectId, phaseId, logId, {
            images: updatedImages
        });

        if (result.success) {
            console.log(`✅ Added ${newImageUrls.length} image(s) to daily log`);
            return { success: true, images: updatedImages };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error adding images to daily log:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete an image from a phase
 * @param {string} projectId - Project ID
 * @param {string} phaseId - Phase ID
 * @param {Array} currentImages - Current phase images
 * @param {string} imageUrl - Image URL to delete
 * @returns {Promise} Success status
 */
export const deleteImageFromPhase = async (projectId, phaseId, currentImages = [], imageUrl) => {
    try {
        // Remove the image URL from the array
        const updatedImages = currentImages.filter(url => url !== imageUrl);

        // Update phase in Firestore
        const result = await updatePhase(projectId, phaseId, {
            images: updatedImages
        });

        if (result.success) {
            console.log('✅ Image deleted from phase');
            return { success: true, images: updatedImages };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error deleting image from phase:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete an image from a daily log
 * @param {string} projectId - Project ID
 * @param {string} phaseId - Phase ID
 * @param {string} logId - Daily Log ID
 * @param {Array} currentImages - Current log images
 * @param {string} imageUrl - Image URL to delete
 * @returns {Promise} Success status
 */
export const deleteImageFromDailyLog = async (projectId, phaseId, logId, currentImages = [], imageUrl) => {
    try {
        // Remove the image URL from the array
        const updatedImages = currentImages.filter(url => url !== imageUrl);

        // Update daily log in Firestore
        const result = await updateDailyLog(projectId, phaseId, logId, {
            images: updatedImages
        });

        if (result.success) {
            console.log('✅ Image deleted from daily log');
            return { success: true, images: updatedImages };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error deleting image from daily log:', error);
        return { success: false, error: error.message };
    }
};

