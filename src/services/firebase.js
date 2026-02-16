/**
 * FIREBASE INITIALIZATION
 * 
 * This file initializes Firebase services:
 * - Authentication
 * - Firestore Database
 * 
 * Note: Storage removed for V1 (text data only)
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase.config';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Enable Offline Persistence
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a a time.
            console.warn('Firestore persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the features required to enable persistence
            console.warn('Firestore persistence failed: Browser not supported');
        }
    });
}

// Log successful initialization in development
if (import.meta.env.DEV) {
    console.log('✅ Firebase initialized successfully');
}

// Export Firebase services
export { app, auth, db };