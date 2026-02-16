/**
 * MATERIAL SERVICE - ENHANCED
 * 
 * Handles all Firestore operations for Material Tracking
 * Collection: projects/{projectId}/materialLogs
 * 
 * Core Materials: Sand, Cement, Labour, Metal, Iron
 * Payment Methods: Cash, PhonePe
 * 
 * Features:
 * - Real-time Firestore listeners
 * - Payment method tracking
 * - Image-based UI support
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    serverTimestamp,
    onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

const MATERIALS = ['Sand', 'Cement', 'Labour', 'Metal', 'Iron'];
const PAYMENT_METHODS = ['Cash', 'PhonePe'];

// Material images (using Unsplash placeholders - replace with actual images)
const MATERIAL_IMAGES = {
    Sand: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    Cement: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=300&fit=crop',
    Labour: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
    Metal: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400&h=300&fit=crop',
    Iron: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=300&fit=crop',
};

/**
 * Subscribe to real-time material logs updates
 * @param {string} projectId - Project ID
 * @param {function} callback - Callback function to receive updates
 * @returns {function} Unsubscribe function
 */
export const subscribeMaterialLogs = (projectId, callback) => {
    const logsRef = collection(db, 'projects', projectId, 'materialLogs');
    const q = query(logsRef, orderBy('date', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
        const logs = [];
        querySnapshot.forEach((doc) => {
            logs.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        console.log('🔄 Real-time update - material logs:', logs.length);
        callback({ success: true, data: logs });
    }, (error) => {
        console.error('❌ Error in real-time listener:', error);
        callback({ success: false, error: error.message });
    });
};

/**
 * Get all material logs for a project (one-time fetch)
 * @param {string} projectId - Project ID
 * @returns {Promise} Array of material logs
 */
export const getMaterialLogs = async (projectId) => {
    try {
        const logsRef = collection(db, 'projects', projectId, 'materialLogs');
        const q = query(logsRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);

        const logs = [];
        querySnapshot.forEach((doc) => {
            logs.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        console.log('✅ Fetched material logs:', logs.length);
        return { success: true, data: logs };
    } catch (error) {
        console.error('❌ Error fetching material logs:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Add a new material log entry
 * @param {string} projectId - Project ID
 * @param {Object} logData - Log data (material, amount, date, paymentMethod)
 * @returns {Promise} Created log ID
 */
export const addMaterialLog = async (projectId, logData) => {
    try {
        // Validate material
        if (!MATERIALS.includes(logData.material)) {
            return { success: false, error: 'Invalid material type' };
        }

        // Validate payment method
        if (logData.paymentMethod && !PAYMENT_METHODS.includes(logData.paymentMethod)) {
            return { success: false, error: 'Invalid payment method' };
        }

        const logsRef = collection(db, 'projects', projectId, 'materialLogs');
        const docRef = await addDoc(logsRef, {
            material: logData.material,
            amount: parseFloat(logData.amount),
            date: logData.date,
            paymentMethod: logData.paymentMethod || 'Cash',
            timestamp: serverTimestamp(),
        });

        console.log('✅ Material log created:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Error creating material log:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a material log entry
 * @param {string} projectId - Project ID
 * @param {string} logId - Log ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Success status
 */
export const updateMaterialLog = async (projectId, logId, updates) => {
    try {
        const logRef = doc(db, 'projects', projectId, 'materialLogs', logId);
        await updateDoc(logRef, {
            ...updates,
            timestamp: serverTimestamp(),
        });

        console.log('✅ Material log updated:', logId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating material log:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a material log entry
 * @param {string} projectId - Project ID
 * @param {string} logId - Log ID
 * @returns {Promise} Success status
 */
export const deleteMaterialLog = async (projectId, logId) => {
    try {
        const logRef = doc(db, 'projects', projectId, 'materialLogs', logId);
        await deleteDoc(logRef);

        console.log('✅ Material log deleted:', logId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting material log:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Calculate material totals from logs array
 * @param {Array} logs - Array of material logs
 * @returns {Object} Totals for each material
 */
export const calculateMaterialTotals = (logs) => {
    const totals = {
        Sand: 0,
        Cement: 0,
        Labour: 0,
        Metal: 0,
        Iron: 0,
    };

    logs.forEach(log => {
        if (totals.hasOwnProperty(log.material)) {
            totals[log.material] += log.amount || 0;
        }
    });

    return totals;
};

/**
 * Get material totals for a project (one-time fetch)
 * @param {string} projectId - Project ID
 * @returns {Promise} Object with totals for each material
 */
export const getMaterialTotals = async (projectId) => {
    try {
        const result = await getMaterialLogs(projectId);

        if (!result.success) {
            return result;
        }

        const totals = calculateMaterialTotals(result.data);
        return { success: true, data: totals };
    } catch (error) {
        console.error('❌ Error calculating material totals:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Group logs by date
 * @param {Array} logs - Array of material logs
 * @returns {Object} Logs grouped by date with sorted dates array
 */
export const groupLogsByDate = (logs) => {
    const logsByDate = {};
    const allDates = new Set();

    logs.forEach(log => {
        const date = log.date;
        allDates.add(date);

        if (!logsByDate[date]) {
            logsByDate[date] = {
                Sand: 0,
                Cement: 0,
                Labour: 0,
                Metal: 0,
                Iron: 0,
            };
        }

        logsByDate[date][log.material] += log.amount || 0;
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));

    return {
        logsByDate,
        dates: sortedDates,
    };
};

/**
 * Get material logs grouped by date (one-time fetch)
 * @param {string} projectId - Project ID
 * @returns {Promise} Object with logs grouped by date
 */
export const getMaterialLogsByDate = async (projectId) => {
    try {
        const result = await getMaterialLogs(projectId);

        if (!result.success) {
            return result;
        }

        const groupedData = groupLogsByDate(result.data);
        return { success: true, data: groupedData };
    } catch (error) {
        console.error('❌ Error grouping material logs:', error);
        return { success: false, error: error.message };
    }
};

export { MATERIALS, PAYMENT_METHODS, MATERIAL_IMAGES };
