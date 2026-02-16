import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../common/Logo';
import styles from './TopBar.module.css';

/**
 * TopBar Component
 * Mobile-only top navigation bar
 */
const TopBar = ({ onMenuClick }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleAuthAction = async () => {
        if (currentUser) {
            await logout();
        } else {
            navigate('/login');
        }
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.topbar__content}>
                <button
                    className={styles.topbar__menu}
                    onClick={onMenuClick}
                    aria-label="Toggle Menu"
                >
                    ☰
                </button>

                <Logo size="small" showText={true} />

                <button
                    className={styles.topbar__auth}
                    onClick={handleAuthAction}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: currentUser ? 'transparent' : 'var(--color-primary)',
                        border: currentUser ? '1px solid var(--color-border)' : 'none',
                        color: currentUser ? 'var(--color-text-secondary)' : 'white',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                    }}
                >
                    {currentUser ? 'Logout' : 'Login'}
                </button>
            </div>
        </header>
    );
};

export default TopBar;
