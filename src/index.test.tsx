import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Mock App component
jest.mock('./App', () => {
    return function MockApp() {
        return <div data-testid="mock-app">Mock App</div>;
    };
});

// Mock reportWebVitals
jest.mock('./reportWebVitals');

// Create a mock root element
const mockRoot = {
    render: jest.fn()
};

// Mock react-dom/client
jest.mock('react-dom/client', () => ({
    createRoot: jest.fn(() => mockRoot)
}));

describe('index.tsx', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // Setup DOM element
        const root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
    });

    afterEach(() => {
        // Cleanup
        document.body.innerHTML = '';
    });

    it('renders App component and calls reportWebVitals', () => {
        // Import the index file to trigger the rendering
        require('./index');

        // Verify root.render was called with React.StrictMode and App
        expect(mockRoot.render).toHaveBeenCalledWith(
            expect.objectContaining({
                type: React.StrictMode,
                props: expect.objectContaining({
                    children: expect.any(Object)
                })
            })
        );

        // Verify reportWebVitals was called
        expect(reportWebVitals).toHaveBeenCalled();
    });
}); 