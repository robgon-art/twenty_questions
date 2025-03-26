import { renderHook, act } from '@testing-library/react';
import { useGameController } from '../useGameController';
import { processGameQuestion } from '../../../services/gameService';
import { MAX_QUESTIONS } from '../../../constants';

// Mock the game service
jest.mock('../../../services/gameService');

describe('useGameController', () => {
    const mockOnGameComplete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with active game state', () => {
        const { result } = renderHook(() => useGameController(mockOnGameComplete));
        
        expect(result.current.state.gameStatus).toBe('active');
        expect(result.current.state.questionsRemaining).toBe(MAX_QUESTIONS);
        expect(result.current.state.questions).toHaveLength(0);
    });

    it('should handle first question correctly', async () => {
        const mockResponse = {
            success: true,
            answer: 'Yes',
            object: 'apple',
            gameStatus: 'ongoing' as const
        };
        (processGameQuestion as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGameController(mockOnGameComplete));

        await act(async () => {
            await result.current.handleQuestion('Is it an animal?');
        });

        expect(result.current.state.currentObject).toBe('apple');
        expect(result.current.state.questions).toHaveLength(1);
        expect(result.current.state.questionsRemaining).toBe(MAX_QUESTIONS - 1);
        expect(result.current.state.gameStatus).toBe('active');
    });

    it('should handle successful game completion', async () => {
        const mockResponse = {
            success: true,
            answer: 'Yes',
            gameStatus: 'success' as const
        };
        (processGameQuestion as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGameController(mockOnGameComplete));

        await act(async () => {
            await result.current.handleQuestion('Is it an apple?');
        });

        expect(result.current.state.gameStatus).toBe('success');
        expect(mockOnGameComplete).toHaveBeenCalledWith(true);
    });

    it('should handle game failure when questions run out', async () => {
        const mockResponse = {
            success: true,
            answer: 'No',
            gameStatus: 'ongoing' as const
        };
        (processGameQuestion as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGameController(mockOnGameComplete));
        
        // Ask all questions to exhaust the limit
        for (let i = 0; i < MAX_QUESTIONS; i++) {
            await act(async () => {
                await result.current.handleQuestion(`Question ${i+1}`);
            });
        }
        
        // After all questions, status should be failed
        expect(result.current.state.gameStatus).toBe('failed');
        expect(result.current.state.questionsRemaining).toBe(0);
    });

    it('should handle error responses', async () => {
        const mockResponse = {
            success: false,
            answer: 'Error occurred',
            error: 'Test error',
            gameStatus: 'ongoing' as const
        };
        (processGameQuestion as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGameController(mockOnGameComplete));

        await act(async () => {
            await result.current.handleQuestion('Is it an animal?');
        });

        expect(result.current.state.currentAnswer).toBe('Error occurred');
    });

    it('should reset game state when starting new game', async () => {
        const { result } = renderHook(() => useGameController(mockOnGameComplete));

        // Modify state first
        await act(async () => {
            result.current.handleAnswer('Yes');
            result.current.startNewGame();
        });

        expect(result.current.state.gameStatus).toBe('active');
        expect(result.current.state.questionsRemaining).toBe(MAX_QUESTIONS);
        expect(result.current.state.questions).toHaveLength(0);
        expect(result.current.state.currentObject).toBeUndefined();
        expect(result.current.state.currentAnswer).toBe('');
    });
}); 