/**
 * DAILY LOG SERVICE
 * 
 * Handles all Firestore operations for Daily Logs
 * Subcollection: projects/{projectId}/phases/{phaseId}/dailyLogs
 * 
 * Ultra-simple structure: Today's work + Tomorrow's needs
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
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Create a new daily log in a phase
 * Simple structure: today's log + tomorrow's needs
 * 
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Parent phase ID
 * @param {Object} logData - Simple log data (date, todayLog, tomorrowNeeds)
 * @returns {Promise} Created log ID
 */
export const createDailyLog = async (projectId, phaseId, logData) => {
    try {
        const logsRef = collection(db, 'projects', projectId, 'phases', phaseId, 'dailyLogs');
        const docRef = await addDoc(logsRef, {
            date: logData.date,
            todayLog: logData.todayLog, // Today's work log
            tomorrowNeeds: logData.tomorrowNeeds, // Tomorrow's requirements
            images: [], // Initialize empty images array
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Daily log created:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Error creating daily log:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all daily logs for a phase
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Parent phase ID
 * @returns {Promise} Array of logs
 */
export const getDailyLogs = async (projectId, phaseId) => {
    try {
        const logsRef = collection(db, 'projects', projectId, 'phases', phaseId, 'dailyLogs');
        const q = query(logsRef, orderBy('date', 'desc'));

        const querySnapshot = await getDocs(q);
        const logs = [];

        querySnapshot.forEach((doc) => {
            logs.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        console.log('✅ Fetched daily logs:', logs.length);
        return { success: true, data: logs };
    } catch (error) {
        console.error('❌ Error fetching daily logs:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get a single daily log by ID
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Parent phase ID
 * @param {string} logId - Log ID
 * @returns {Promise} Log data
 */
export const getDailyLogById = async (projectId, phaseId, logId) => {
    try {
        const logRef = doc(db, 'projects', projectId, 'phases', phaseId, 'dailyLogs', logId);
        const docSnap = await getDoc(logRef);

        if (docSnap.exists()) {
            console.log('✅ Daily log found:', logId);
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() }
            };
        } else {
            console.log('❌ Daily log not found:', logId);
            return { success: false, error: 'Daily log not found' };
        }
    } catch (error) {
        console.error('❌ Error fetching daily log:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a daily log
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Parent phase ID
 * @param {string} logId - Log ID
 * @param {Object} updates - Fields to update (todayLog, tomorrowNeeds)
 * @returns {Promise} Success status
 */
export const updateDailyLog = async (projectId, phaseId, logId, updates) => {
    try {
        const logRef = doc(db, 'projects', projectId, 'phases', phaseId, 'dailyLogs', logId);
        await updateDoc(logRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Daily log updated:', logId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating daily log:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a daily log
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Parent phase ID
 * @param {string} logId - Log ID
 * @returns {Promise} Success status
 */
export const deleteDailyLog = async (projectId, phaseId, logId) => {
    try {
        const logRef = doc(db, 'projects', projectId, 'phases', phaseId, 'dailyLogs', logId);
        await deleteDoc(logRef);

        console.log('✅ Daily log deleted:', logId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting daily log:', error);
        return { success: false, error: error.message };
    }
};
