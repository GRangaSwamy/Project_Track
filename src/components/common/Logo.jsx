import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Logo Component - ConstructaX Branding
 * Text-based premium branding for Lakshmi Constructions
 * 
 * @param {Object} props
 * @param {string} [props.size='medium'] - small, medium, large
 * @param {boolean} [props.showText=true] - whether to show tagline
 */
const Logo = ({ size = 'medium', showText = true }) => {
    const navigate = useNavigate();

    const sizes = {
        small: { main: '1.25rem', sub: '0.5rem', gap: '2px' },
        medium: { main: '1.75rem', sub: '0.65rem', gap: '4px' },
        large: { main: '2.5rem', sub: '0.875rem', gap: '6px' }
    };

    const currentSize = sizes[size] || sizes.medium;
    const accentColor = '#F59E0B'; // Construction Yellow/Orange

    return (
        <div
            onClick={() => navigate('/')}
            className="constructax-logo"
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.3s ease',
                padding: '4px 8px',
                borderRadius: '8px',
                maxWidth: '100%',
                alignItems: 'inherit' // Controlled by CSS for responsive alignment
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                const x = e.currentTarget.querySelector('.logo-x');
                if (x) x.style.textShadow = `0 0 15px ${accentColor}88`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                const x = e.currentTarget.querySelector('.logo-x');
                if (x) x.style.textShadow = 'none';
            }}
        >
            <style>
                {`
                .constructax-logo {
                    align-items: flex-start;
                }
                .constructax-tagline {
                    white-space: normal;
                    text-align: left;
                    max-width: 100%;
                }
                @media (max-width: 768px) {
                    .constructax-logo {
                        align-items: center;
                        width: 100%;
                    }
                    .constructax-tagline {
                        text-align: center;
                        font-size: calc(${currentSize.sub} * 0.9) !important;
                        letter-spacing: 0.1em !important;
                    }
                }
                `}
            </style>
            <div style={{
                display: 'flex',
                alignItems: 'baseline',
                lineHeight: '1',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <span style={{
                    color: 'white',
                    fontSize: currentSize.main,
                    textTransform: 'uppercase'
                }}>
                    Constructa
                </span>
                <span
                    className="logo-x"
                    style={{
                        color: accentColor,
                        fontSize: currentSize.main,
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                    }}
                >
                    X
                </span>
            </div>

            {showText && (
                <div
                    className="constructax-tagline"
                    style={{
                        fontSize: currentSize.sub,
                        color: '#94a3b8', // Light slate/gray
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontWeight: '600',
                        marginTop: currentSize.gap,
                        opacity: '0.8',
                        lineHeight: '1.4'
                    }}
                >
                    A product from Lakshmi Constructions
                </div>
            )}
        </div>
    );
};

export default Logo;
