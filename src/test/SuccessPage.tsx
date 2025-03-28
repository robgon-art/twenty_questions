import React from 'react';
import ConfettiEffect from '../effects/ConfettiEffect';

const SuccessPage: React.FC = () => {
    return (
        <div style={{
            backgroundColor: 'white',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
        }}>
            <ConfettiEffect />
            <h1 style={{ 
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 1
            }}>Success</h1>
        </div>
    );
};

export default SuccessPage; 