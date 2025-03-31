import React, { useState, useEffect } from 'react';
import RainEffect from '../effects/RainEffect';

const FailurePage: React.FC = () => {
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        // Fade in the rain effect
        const fadeInTimer = setTimeout(() => {
            setOpacity(1);
        }, 100);

        const fadeOutTimer = setTimeout(() => {
            setOpacity(0);
        }, 8000); // Start fade out at 8 seconds

        return () => {
            clearTimeout(fadeInTimer);
            clearTimeout(fadeOutTimer);
        };
    }, []);

    return (
        <div style={{
            backgroundColor: 'white',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: opacity,
                transition: 'opacity 1s ease-out',
                pointerEvents: 'none'
            }}>
                <RainEffect />
            </div>
            <h1 style={{ 
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 2
            }}>Failure</h1>
        </div>
    );
};

export default FailurePage; 