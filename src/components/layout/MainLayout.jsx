import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import styles from './MainLayout.module.css';

/**
 * MainLayout Component
 * Provides the main application layout structure
 * - Desktop: Sidebar navigation
 * - Mobile: Top bar + Bottom navigation
 */
const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className={styles['main-layout']}>
            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className={styles['main-layout__backdrop']}
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar - Desktop static, Mobile toggleable */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <div className={styles['main-layout__content']}>
                {/* Top Bar - Mobile only */}
                <TopBar onMenuClick={toggleSidebar} />

                {/* Main content area */}
                <main className={styles['main-layout__main']}>
                    <Outlet />
                </main>
            </div>

            {/* Bottom Navigation - Mobile only */}
            <BottomNav />
        </div>
    );
};

export default MainLayout;
