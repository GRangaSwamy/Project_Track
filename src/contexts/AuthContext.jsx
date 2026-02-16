import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser, onAuthChange } from '../services/authService';

/**
 * Authentication Context
 * Manages user authentication state across the application
 * Integrated with Firebase Authentication
 */

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Signup function
    const signup = async (email, password, displayName) => {
        try {
            const result = await registerUser(email, password, displayName);
            return result;
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.message };
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            const result = await loginUser(email, password);
            return result;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    };


    // Logout function
    const logout = async () => {
        try {
            const result = await logoutUser();
            return result;
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    };

    // Listen to authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            if (user) {
                // User is signed in
                setCurrentUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                });
                console.log('🔐 User authenticated:', user.email);
            } else {
                // User is signed out
                setCurrentUser(null);
                console.log('🔓 User signed out');
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        loading,
    };


    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
