import React from 'react';

const PageLoader = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            background: 'var(--bg-primary)',
            zIndex: 9999
        }}>
            <div className="loader">
                {/* Simple CSS spinner or lottie if you prefer, but keeping it light */}
                <style>
                    {`
                        .loader {
                            width: 48px;
                            height: 48px;
                            border: 5px solid var(--primary-light);
                            border-bottom-color: var(--primary);
                            border-radius: 50%;
                            display: inline-block;
                            box-sizing: border-box;
                            animation: rotation 1s linear infinite;
                        }

                        @keyframes rotation {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        </div>
    );
};

export default PageLoader;
