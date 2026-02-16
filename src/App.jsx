import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Components
import PrivateRoute from './components/auth/PrivateRoute'
import MainLayout from './components/layout/MainLayout'
import ErrorBoundary from './components/common/ErrorBoundary'
import PageLoader from './components/common/PageLoader'

// Lazy loaded Pages
const Login = lazy(() => import('./pages/auth/Login'))
const SignUp = lazy(() => import('./pages/auth/SignUp'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AddProject = lazy(() => import('./pages/projects/AddProject'))
const ProjectDetail = lazy(() => import('./pages/projects/ProjectDetail'))
const PhaseDetail = lazy(() => import('./pages/phases/PhaseDetail'))

// Production console suppression
if (import.meta.env.PROD) {
    console.log = () => { };
    console.debug = () => { };
    console.info = () => { };
    // Keep console.error and console.warn for critical issues
}

/**
 * Main App Component
 * Handles routing and authentication context
 */
function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Router>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />

                            {/* Protected Routes */}
                            <Route element={<PrivateRoute />}>
                                <Route element={<MainLayout />}>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/add-project" element={<AddProject />} />
                                    <Route path="/project/:projectId" element={<ProjectDetail />} />
                                    <Route path="/project/:projectId/phase/:phaseId" element={<PhaseDetail />} />
                                </Route>
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    )
}

export default App

