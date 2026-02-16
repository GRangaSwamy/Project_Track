import React, { useEffect } from 'react';
import styles from './Modal.module.css';

/**
 * Modal Component
 * Reusable modal dialog with overlay
 * 
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Modal footer (optional)
 * @param {string} size - Modal size: 'default' or 'large' (optional)
 */
const Modal = ({ isOpen, onClose, title, children, footer, size = 'default' }) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={styles['modal-overlay']}
            onClick={onClose}
        >
            <div
                className={`${styles.modal} ${size === 'large' ? styles['modal--large'] : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modal__header}>
                    <h2 className={styles.modal__title}>{title}</h2>
                    <button
                        className={styles.modal__close}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <div className={styles.modal__body}>
                    {children}
                </div>

                {footer && (
                    <div className={styles.modal__footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
