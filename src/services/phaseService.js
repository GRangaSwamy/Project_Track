/**
 * PHASE SERVICE
 * 
 * Handles all Firestore operations for Phases
 * Subcollection: projects/{projectId}/phases
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
 * Create a new phase in a project
 * @param {string} projectId - Parent project ID
 * @param {Object} phaseData - Phase data (phaseName, workType, startDate, phaseCost, totalQuantity)
 * @returns {Promise} Created phase ID
 */
export const createPhase = async (projectId, phaseData) => {
    try {
        const phasesRef = collection(db, 'projects', projectId, 'phases');
        const docRef = await addDoc(phasesRef, {
            ...phaseData,
            images: [], // Initialize empty images array
            progress: 0, // Initialize progress at 0%
            status: 'ongoing', // ongoing | completed
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Phase created:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Error creating phase:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all phases for a project
 * @param {string} projectId - Parent project ID
 * @returns {Promise} Array of phases
 */
export const getPhases = async (projectId) => {
    try {
        const phasesRef = collection(db, 'projects', projectId, 'phases');
        const q = query(phasesRef, orderBy('createdAt', 'asc'));

        const querySnapshot = await getDocs(q);
        const phases = [];

        querySnapshot.forEach((doc) => {
            phases.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        console.log('✅ Fetched phases:', phases.length);
        return { success: true, data: phases };
    } catch (error) {
        console.error('❌ Error fetching phases:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get a single phase by ID
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Phase ID
 * @returns {Promise} Phase data
 */
export const getPhaseById = async (projectId, phaseId) => {
    try {
        const phaseRef = doc(db, 'projects', projectId, 'phases', phaseId);
        const docSnap = await getDoc(phaseRef);

        if (docSnap.exists()) {
            console.log('✅ Phase found:', phaseId);
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() }
            };
        } else {
            console.log('❌ Phase not found:', phaseId);
            return { success: false, error: 'Phase not found' };
        }
    } catch (error) {
        console.error('❌ Error fetching phase:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a phase
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Phase ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Success status
 */
export const updatePhase = async (projectId, phaseId, updates) => {
    try {
        const phaseRef = doc(db, 'projects', projectId, 'phases', phaseId);
        await updateDoc(phaseRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Phase updated:', phaseId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating phase:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a phase and all its daily logs (cascading delete)
 * @param {string} projectId - Parent project ID
 * @param {string} phaseId - Phase ID
 * @returns {Promise} Success status
 */
export const deletePhase = async (projectId, phaseId) => {
    try {
        // 1. Get all daily logs for this phase
        const logsRef = collection(db, 'projects', projectId, 'phases', phaseId, 'dailyLogs');
        const logsSnapshot = await getDocs(logsRef);

        // 2. Delete each log
        const deletePromises = logsSnapshot.docs.map(logDoc => {
            return deleteDoc(doc(db, 'projects', projectId, 'phases', phaseId, 'dailyLogs', logDoc.id));
        });
        await Promise.all(deletePromises);
        console.log(`🧹 Deleted ${deletePromises.length} daily logs for phase:`, phaseId);

        // 3. Delete the phase itself
        const phaseRef = doc(db, 'projects', projectId, 'phases', phaseId);
        await deleteDoc(phaseRef);

        console.log('✅ Phase and its logs deleted:', phaseId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting phase:', error);
        return { success: false, error: error.message };
    }
};

