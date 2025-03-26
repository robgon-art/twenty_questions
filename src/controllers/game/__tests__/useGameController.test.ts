import { renderHook, act } from '@testing-library/react';
import { useGameController } from '../useGameController';
import { processGameQuestion } from '../../../services/gameService';

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
        expect(result.current.state.questionsRemaining).toBe(20);
        expect(result.current.state.questions).toHaveLength(0);
    });

    it('should handle first question correctly', async () => {
        const mockResponse = {
            success: true,
            object: 'apple',
            answer: 'Yes',
            gameStatus: 'ongoing' as const
        };
        (processGameQuestion as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGameController(mockOnGameComplete));

        await act(async () => {
            await result.current.handleQuestion('Is it a fruit?');
        });

        expect(result.current.state.currentObject).toBe('apple');
        expect(result.current.state.questions).toHaveLength(1);
        expect(result.current.state.questionsRemaining).toBe(19);
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

    it('should handle error responses', async () => {
        const mockResponse = {
            success: false,
            answer: 'Error message',
            gameStatus: 'ongoing' as const
        };
        (processGameQuestion as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGameController(mockOnGameComplete));

        await act(async () => {
            await result.current.handleQuestion('Is it a fruit?');
        });

        expect(result.current.state.questions).toHaveLength(1);
        expect(result.current.state.questions[0].answer).toBe('Error message');
        expect(result.current.state.gameStatus).toBe('active');
    });

    it('should reset game state when starting new game', () => {
        const { result } = renderHook(() => useGameController(mockOnGameComplete));

        // Set up a modified state
        act(() => {
            result.current.state = {
                questions: [{ text: 'test', answer: 'test', timestamp: new Date() }],
                currentAnswer: 'test',
                currentObject: 'apple',
                gameStatus: 'success' as const,
                questionsRemaining: 15
            };
        });

        act(() => {
            result.current.startNewGame();
        });

        expect(result.current.state.gameStatus).toBe('active');
        expect(result.current.state.questionsRemaining).toBe(20);
        expect(result.current.state.questions).toHaveLength(0);
        expect(result.current.state.currentObject).toBeUndefined();
        expect(result.current.state.currentAnswer).toBe('');
    });

    it('should set game status to failed after 20 questions', async () => {
        const mockResponse = {
            success: true,
            answer: 'No',
            gameStatus: 'ongoing' as const
        };
        (processGameQuestion as jest.Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useGameController(mockOnGameComplete));
        
        // Ask all 20 questions to exhaust the limit
        for (let i = 0; i < 20; i++) {
            await act(async () => {
                await result.current.handleQuestion(`Question ${i+1}`);
            });
        }
        
        // After 20 questions, status should be failed
        expect(result.current.state.gameStatus).toBe('failed');
        expect(result.current.state.questionsRemaining).toBe(0);
    });
}); 