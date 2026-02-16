import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component
 * Reusable button with multiple variants and sizes
 * 
 * @param {string} variant - primary | secondary | success | danger | outline
 * @param {string} size - small | medium | large
 * @param {boolean} fullWidth - Make button full width
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {function} onClick - Click handler
 * @param {string} type - button | submit | reset
 * @param {ReactNode} children - Button content
 */
const Button = ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    children,
    className = '',
    ...props
}) => {
    const buttonClasses = [
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        fullWidth && styles['button--full-width'],
        loading && styles['button--loading'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled || loading}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
