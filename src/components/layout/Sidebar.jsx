import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';
import Button from '../common/Button';
import styles from './Sidebar.module.css';

/**
 * Sidebar Component
 * Desktop navigation sidebar with logo, menu items, and user info
 */
const Sidebar = ({ isOpen, onClose }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        if (onClose) onClose();
    };

    const handleLogin = () => {
        navigate('/login');
        if (onClose) onClose();
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!currentUser?.email) return '?';
        return currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase();
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles['sidebar--open'] : ''}`}>
            {/* Header with Logo */}
            <div className={styles.sidebar__header}>
                <Logo />
                {onClose && (
                    <button className={styles.sidebar__close} onClick={onClose}>
                        ✕
                    </button>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className={styles.sidebar__nav}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${styles['sidebar__nav-item']} ${isActive ? styles['sidebar__nav-item--active'] : ''}`
                    }
                    onClick={() => onClose && onClose()}
                    end
                >
                    <span className={styles['sidebar__nav-icon']}>📊</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/add-project"
                    className={({ isActive }) =>
                        `${styles['sidebar__nav-item']} ${isActive ? styles['sidebar__nav-item--active'] : ''}`
                    }
                    onClick={() => onClose && onClose()}
                >
                    <span className={styles['sidebar__nav-icon']}>➕</span>
                    <span>Add Project</span>
                </NavLink>
            </nav>

            {/* Footer with User Info / Auth */}
            <div className={styles.sidebar__footer}>
                {currentUser ? (
                    <>
                        <div className={styles.sidebar__user}>
                            <div className={styles['sidebar__user-avatar']}>
                                {getUserInitials()}
                            </div>
                            <div className={styles['sidebar__user-info']}>
                                <div className={styles['sidebar__user-name']}>
                                    {currentUser.displayName || 'User'}
                                </div>
                                <div className={styles['sidebar__user-email']}>
                                    {currentUser.email}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="small"
                            fullWidth
                            onClick={handleLogout}
                        >
                            Logout 🚪
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        onClick={handleLogin}
                    >
                        Sign In 🔑
                    </Button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
