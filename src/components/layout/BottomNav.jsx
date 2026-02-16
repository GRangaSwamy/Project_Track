import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

/**
 * BottomNav Component
 * Mobile-only bottom navigation bar
 */
const BottomNav = () => {
    return (
        <nav className={styles['bottom-nav']}>
            <div className={styles['bottom-nav__items']}>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `${styles['bottom-nav__item']} ${isActive ? styles['bottom-nav__item--active'] : ''
                        }`
                    }
                    end
                >
                    <span className={styles['bottom-nav__icon']}>📊</span>
                    <span className={styles['bottom-nav__label']}>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/add-project"
                    className={({ isActive }) =>
                        `${styles['bottom-nav__item']} ${isActive ? styles['bottom-nav__item--active'] : ''
                        }`
                    }
                >
                    <span className={styles['bottom-nav__icon']}>➕</span>
                    <span className={styles['bottom-nav__label']}>Add Project</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
