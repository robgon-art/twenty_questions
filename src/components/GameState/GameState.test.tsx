import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './GameState';

describe('useGameState', () => {
    const mockOnGameComplete = jest.fn();

    beforeEach(() => {
        mockOnGameComplete.mockClear();
    });

    it('initializes with correct state', () => {
        const { result } = renderHook(() => useGameState(mockOnGameComplete));
        
        expect(result.current.state).toEqual({
            questions: [],
            currentAnswer: '',
            gameStatus: 'active',
            questionsRemaining: 20
        });
    });

    it('handles questions correctly', () => {
        const { result } = renderHook(() => useGameState(mockOnGameComplete));
        
        act(() => {
            result.current.handleQuestion('Is it an animal?');
        });

        expect(result.current.state.questions).toHaveLength(1);
        expect(result.current.state.questions[0].text).toBe('Is it an animal?');
        expect(result.current.state.questionsRemaining).toBe(19);
    });

    it('handles answers correctly', () => {
        const { result } = renderHook(() => useGameState(mockOnGameComplete));
        
        act(() => {
            result.current.handleAnswer('Yes');
        });

        expect(result.current.state.currentAnswer).toBe('Yes');
    });

    it('completes game after 20 questions', () => {
        const { result } = renderHook(() => useGameState(mockOnGameComplete));
        
        // Ask 20 questions
        for (let i = 0; i < 20; i++) {
            act(() => {
                result.current.handleQuestion(`Question ${i}`);
            });
        }

        expect(result.current.state.gameStatus).toBe('complete');
        expect(result.current.state.questionsRemaining).toBe(0);
        expect(mockOnGameComplete).toHaveBeenCalledWith(false);
    });

    it('starts new game correctly', () => {
        const { result } = renderHook(() => useGameState(mockOnGameComplete));
        
        // First ask a question
        act(() => {
            result.current.handleQuestion('Is it an animal?');
        });

        // Then start a new game
        act(() => {
            result.current.startNewGame();
        });

        expect(result.current.state).toEqual({
            questions: [],
            currentAnswer: '',
            gameStatus: 'active',
            questionsRemaining: 20
        });
    });
}); 