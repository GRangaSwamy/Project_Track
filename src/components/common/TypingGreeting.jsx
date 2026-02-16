import React, { useState, useEffect } from 'react';

/**
 * TypingGreeting Component
 * Displays a personalized greeting with a typing animation effect
 * 
 * @param {Object} props
 * @param {string} props.name - The name of the user to greet
 */
const TypingGreeting = ({ name }) => {
    const [displayText, setDisplayText] = useState('');
    const [isFinished, setIsFinished] = useState(false);

    // Customize the greeting message
    const greetingText = `Welcome, ${name || 'User'}! 👋`;
    const typingSpeed = 100; // Speed in ms per character

    useEffect(() => {
        // Reset state when name changes
        setDisplayText('');
        setIsFinished(false);

        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex <= greetingText.length) {
                setDisplayText(greetingText.slice(0, currentIndex));
                currentIndex++;
            } else {
                setIsFinished(true);
                clearInterval(interval);
            }
        }, typingSpeed);

        return () => clearInterval(interval);
    }, [name, greetingText]);

    return (
        <div style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            background: 'linear-gradient(90deg, var(--color-primary), #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 'var(--spacing-lg)',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '-0.02em',
            minHeight: '2.5rem' // Prevent layout shift
        }}>
            <span>{displayText}</span>
            <span style={{
                display: isFinished ? 'none' : 'inline-block',
                width: '3px',
                height: '1.2em',
                backgroundColor: 'var(--color-primary)',
                marginLeft: '6px',
                animation: 'blink 0.8s step-end infinite',
                verticalAlign: 'middle'
            }} />
            <style>
                {`
                @keyframes blink {
                    from, to { opacity: 1; }
                    50% { opacity: 0; }
                }
                `}
            </style>
        </div>
    );
};

export default TypingGreeting;
