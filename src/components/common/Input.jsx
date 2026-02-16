import React from 'react';
import styles from './Input.module.css';

/**
 * Input Component
 * Reusable form input with label, error, and helper text
 * 
 * @param {string} label - Input label
 * @param {string} type - Input type (text, email, password, number, date, etc.)
 * @param {string} name - Input name
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Mark as required
 * @param {boolean} disabled - Disable input
 * @param {string} error - Error message
 * @param {string} helper - Helper text
 * @param {string} as - Render as 'input', 'textarea', or 'select'
 */
const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    helper,
    as = 'input',
    children,
    className = '',
    ...props
}) => {
    const inputClasses = [
        styles.input,
        as === 'textarea' && styles.textarea,
        as === 'select' && styles.select,
        error && styles['input--error'],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const labelClasses = [
        styles['input-label'],
        required && styles['input-label--required'],
    ]
        .filter(Boolean)
        .join(' ');

    const InputElement = as;

    return (
        <div className={styles['input-group']}>
            {label && (
                <label htmlFor={name} className={labelClasses}>
                    {label}
                </label>
            )}

            <InputElement
                id={name}
                name={name}
                type={as === 'input' ? type : undefined}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={inputClasses}
                {...props}
            >
                {children}
            </InputElement>

            {error && <span className={styles['input-error']}>{error}</span>}
            {helper && !error && <span className={styles['input-helper']}>{helper}</span>}
        </div>
    );
};

export default Input;
