import React from 'react';
import styles from './Card.module.css';

/**
 * Card Component
 * Reusable card container with optional header and footer
 * 
 * @param {ReactNode} children - Card content
 * @param {string} title - Card title (optional)
 * @param {string} subtitle - Card subtitle (optional)
 * @param {ReactNode} footer - Card footer content (optional)
 * @param {boolean} hoverable - Enable hover effect
 * @param {boolean} clickable - Show pointer cursor
 * @param {function} onClick - Click handler
 * @param {string} variant - bordered | elevated
 * @param {string} padding - compact | normal | spacious
 */
const Card = ({
    children,
    title,
    subtitle,
    footer,
    hoverable = false,
    clickable = false,
    onClick,
    variant,
    padding = 'normal',
    className = '',
    ...props
}) => {
    const cardClasses = [
        styles.card,
        hoverable && styles['card--hoverable'],
        clickable && styles['card--clickable'],
        variant && styles[`card--${variant}`],
        padding !== 'normal' && styles[`card--${padding}`],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClasses} onClick={onClick} {...props}>
            {(title || subtitle) && (
                <div className={styles.card__header}>
                    {title && <h3 className={styles.card__title}>{title}</h3>}
                    {subtitle && <p className={styles.card__subtitle}>{subtitle}</p>}
                </div>
            )}

            <div className={styles.card__body}>{children}</div>

            {footer && <div className={styles.card__footer}>{footer}</div>}
        </div>
    );
};

export default Card;
