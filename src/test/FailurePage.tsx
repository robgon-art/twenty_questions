import React from 'react';

const FailurePage: React.FC = () => {
    return (
        <div style={{
            backgroundColor: 'white',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ fontWeight: 'bold' }}>Failure</h1>
        </div>
    );
};

export default FailurePage; 