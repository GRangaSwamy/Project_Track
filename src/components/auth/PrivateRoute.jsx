import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
const PrivateRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="text-secondary">Loading...</div>
            </div>
        );
    }

    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
