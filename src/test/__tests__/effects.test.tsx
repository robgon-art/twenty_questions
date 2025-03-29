import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfettiEffect from '../../effects/ConfettiEffect';
import SuccessPage from '../SuccessPage';
import FailurePage from '../FailurePage';

// Create mock functions that can be accessed in both the mock and test
const mockPlay = jest.fn();
const mockDestroy = jest.fn();

// Mock the tsparticles library
jest.mock('react-tsparticles', () => {
    const mockParticles = ({ init, loaded }: { init: (engine: any) => Promise<void>, loaded: (container: any) => Promise<void> }) => {
        // Call init and loaded immediately to test the callbacks
        init({}).then(() => {
            loaded({ play: mockPlay, destroy: mockDestroy });
        });

        return <div data-testid="particles-container">Particles</div>;
    };
    return { __esModule: true, default: mockParticles };
});

// Mock the tsparticles-engine loadFull function
jest.mock('tsparticles', () => ({
    loadFull: jest.fn().mockResolvedValue(undefined)
}));

describe('ConfettiEffect', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        // Reset mock functions before each test
        mockPlay.mockReset();
        mockDestroy.mockReset();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders without crashing', () => {
        render(<ConfettiEffect />);
        expect(screen.getByTestId('particles-container')).toBeInTheDocument();
    });

    it('initializes particles engine', async () => {
        const { loadFull } = require('tsparticles');
        render(<ConfettiEffect />);
        
        // Wait for the next tick to allow the async initialization
        await act(async () => {
            await Promise.resolve();
        });

        expect(loadFull).toHaveBeenCalled();
    });

    it('handles particle container lifecycle', async () => {
        // Mock setTimeout to control timing
        const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

        render(<ConfettiEffect />);

        // Wait for the next tick to allow the async initialization
        await act(async () => {
            await Promise.resolve();
        });

        // Verify that setTimeout was called twice (for play and destroy)
        expect(setTimeoutSpy).toHaveBeenCalledTimes(2);

        // Get the callbacks that were passed to setTimeout
        const [playCallback, destroyCallback] = setTimeoutSpy.mock.calls.map(call => call[0]);

        // Execute the callbacks
        await act(async () => {
            playCallback();
            await Promise.resolve();
        });
        expect(mockPlay).toHaveBeenCalledWith(false);

        await act(async () => {
            destroyCallback();
            await Promise.resolve();
        });
        expect(mockDestroy).toHaveBeenCalled();
    });
});

describe('SuccessPage', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders success message', () => {
        render(<SuccessPage />);
        expect(screen.getByText('Success')).toBeInTheDocument();
    });

    it('shows confetti effect', () => {
        render(<SuccessPage />);
        expect(screen.getByTestId('particles-container')).toBeInTheDocument();
    });

    it('handles fade in and out correctly', () => {
        render(<SuccessPage />);
        
        // Initial state
        const effectContainer = screen.getByTestId('particles-container').parentElement;
        expect(effectContainer).toHaveStyle({ opacity: '0' });

        // After 100ms (fade in)
        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(effectContainer).toHaveStyle({ opacity: '1' });

        // After 8 seconds (fade out)
        act(() => {
            jest.advanceTimersByTime(8000);
        });
        expect(effectContainer).toHaveStyle({ opacity: '0' });
    });
});

describe('FailurePage', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders failure message', () => {
        render(<FailurePage />);
        expect(screen.getByText('Failure')).toBeInTheDocument();
    });

    it('shows rain effect', () => {
        render(<FailurePage />);
        expect(screen.getByTestId('particles-container')).toBeInTheDocument();
    });

    it('handles fade in and out correctly', () => {
        render(<FailurePage />);
        
        // Initial state
        const effectContainer = screen.getByTestId('particles-container').parentElement;
        expect(effectContainer).toHaveStyle({ opacity: '0' });

        // After 100ms (fade in)
        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(effectContainer).toHaveStyle({ opacity: '1' });

        // After 8 seconds (fade out)
        act(() => {
            jest.advanceTimersByTime(8000);
        });
        expect(effectContainer).toHaveStyle({ opacity: '0' });
    });
}); 