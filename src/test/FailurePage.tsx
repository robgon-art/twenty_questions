import React, { useState, useEffect } from 'react';
import RainEffect from '../effects/RainEffect';

const FailurePage: React.FC = () => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpacity(0);
        }, 8000); // Start fade out at 8 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            backgroundColor: 'white',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: opacity,
                transition: 'opacity 1s ease-out'
            }}>
                <RainEffect />
            </div>
            <h1 style={{ 
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 1
            }}>Failure</h1>
        </div>
    );
};

export default FailurePage; 