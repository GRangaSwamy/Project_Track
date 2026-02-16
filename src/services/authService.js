/**
 * AUTH SERVICE
 * 
 * Handles all Firebase Authentication operations:
 * - Registration (Sign Up)
 * - Login
 * - Logout
 * - User Profile Persistence in Firestore
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from 'firebase/auth';
import {
    doc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';

const USERS_COLLECTION = 'users';

/**
 * Listener for auth state changes
 * @param {Function} callback 
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};


/**
 * Sign Up a new user
 * @param {string} email - User email
 * @param {string} password - User password (min 6 chars)
 * @param {string} displayName - Optional display name
 * @returns {Promise} Result object { success, user, error }
 */
export const registerUser = async (email, password, displayName) => {
    try {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Update Auth profile with display name if provided
        if (displayName) {
            await updateProfile(user, { displayName });
        }

        // 3. Create user document in Firestore
        const userDocRef = doc(db, USERS_COLLECTION, user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: displayName || user.email.split('@')[0], // Fallback to email prefix
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            status: 'active'
        });

        console.log('✅ User registered successfully:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('❌ Error in registration:', error.code, error.message);

        let errorMessage = 'Failed to create account.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address.';
        }

        return { success: false, error: errorMessage };
    }
};

/**
 * Login existing user
 * @param {string} email 
 * @param {string} password 
 */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('❌ Error in login:', error.code, error.message);
        return { success: false, error: 'Invalid email or password.' };
    }
};

/**
 * Logout current user
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('❌ Error logging out:', error);
        return { success: false, error: error.message };
    }
};
