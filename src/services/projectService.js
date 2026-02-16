/**
 * PROJECT SERVICE
 * 
 * Handles all Firestore operations for Projects
 * Collection: projects
 * 
 * V1 Scope: Text data only (no image uploads)
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
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

import { deletePhase } from './phaseService';

const PROJECTS_COLLECTION = 'projects';

/**
 * Create a new project
 * @param {Object} projectData - Project data (name, startDate, estimatedCost, status, userId)
 * @returns {Promise} Created project ID
 */
export const createProject = async (projectData) => {
    try {
        if (!projectData.userId) {
            throw new Error('User ID is required to create a project');
        }

        const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
            name: projectData.name,
            startDate: projectData.startDate,
            estimatedCost: parseFloat(projectData.estimatedCost) || 0,
            status: projectData.status || 'ongoing',
            projectImageUrl: projectData.projectImageUrl || '',
            userId: projectData.userId, // Associate with user
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Project created:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ Error creating project:', error);
        return { success: false, error: error.message };
    }
};


/**
 * Get all projects for a specific user
 * @param {string} userId - User ID to filter by
 * @returns {Promise} Array of projects
 */
export const getAllProjects = async (userId) => {
    try {
        if (!userId) {
            throw new Error('User ID is required to fetch projects');
        }

        const q = query(
            collection(db, PROJECTS_COLLECTION),
            where('userId', '==', userId), // Filter by user
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const projects = [];

        querySnapshot.forEach((doc) => {
            projects.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        console.log('✅ Fetched projects:', projects.length);
        return { success: true, data: projects };
    } catch (error) {
        console.error('❌ Error fetching projects:', error);

        // Handle missing index error specifically
        if (error.code === 'failed-precondition' || error.message?.includes('requires an index')) {
            return {
                success: false,
                error: 'DATABASE_INDEX_REQUIRED',
                message: 'This view requires a database index. If you are the developer, please check the console for the index creation link.'
            };
        }

        return { success: false, error: error.message };
    }
};

/**
 * Get a single project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise} Project data
 */
export const getProjectById = async (projectId) => {
    try {
        const docRef = doc(db, PROJECTS_COLLECTION, projectId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('✅ Project found:', projectId);
            return {
                success: true,
                data: { id: docSnap.id, ...docSnap.data() }
            };
        } else {
            console.log('❌ Project not found:', projectId);
            return { success: false, error: 'Project not found' };
        }
    } catch (error) {
        console.error('❌ Error fetching project:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update a project
 * @param {string} projectId - Project ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} Success status
 */
export const updateProject = async (projectId, updates) => {
    try {
        const docRef = doc(db, PROJECTS_COLLECTION, projectId);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Project updated:', projectId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error updating project:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete a project and all its phases (cascading delete)
 * @param {string} projectId - Project ID
 * @returns {Promise} Success status
 */
export const deleteProject = async (projectId) => {
    try {
        // 1. Get all phases for this project
        const phasesRef = collection(db, 'projects', projectId, 'phases');
        const phasesSnapshot = await getDocs(phasesRef);

        // 2. Delete each phase (this will also delete its daily logs due to deletePhase logic)
        const deletePromises = phasesSnapshot.docs.map(phaseDoc => {
            return deletePhase(projectId, phaseDoc.id);
        });
        await Promise.all(deletePromises);
        console.log(`🧹 Deleted ${deletePromises.length} phases for project:`, projectId);

        // 3. Delete the project document
        const docRef = doc(db, PROJECTS_COLLECTION, projectId);
        await deleteDoc(docRef);

        console.log('✅ Project and all its content deleted:', projectId);
        return { success: true };
    } catch (error) {
        console.error('❌ Error deleting project:', error);
        return { success: false, error: error.message };
    }
};

