import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameInterface from './GameInterface';
import type { GameState } from '../GameState/GameState';

describe('GameInterface', () => {
    const mockOnAskQuestion = jest.fn();
    const mockOnStartNewGame = jest.fn();
    const mockGameState: GameState = {
        questions: [],
        currentAnswer: '',
        gameStatus: 'active',
        questionsRemaining: 20
    };

    beforeEach(() => {
        mockOnAskQuestion.mockClear();
        mockOnStartNewGame.mockClear();
    });

    it('renders with the correct title and subtitle', () => {
        render(
            <GameInterface 
                onAskQuestion={mockOnAskQuestion}
                gameState={mockGameState}
                onStartNewGame={mockOnStartNewGame}
            />
        );
        
        expect(screen.getByText('Twenty Questions')).toBeInTheDocument();
        expect(screen.getByText('See if you can guess what I am thinking of.')).toBeInTheDocument();
    });

    it('renders with the initial question', () => {
        render(
            <GameInterface 
                onAskQuestion={mockOnAskQuestion}
                gameState={mockGameState}
                onStartNewGame={mockOnStartNewGame}
            />
        );
        
        const input = screen.getByDisplayValue('Is it an animal, mineral, or vegetable?');
        expect(input).toBeInTheDocument();
    });

    it('calls onAskQuestion when a question is submitted', () => {
        render(
            <GameInterface 
                onAskQuestion={mockOnAskQuestion}
                gameState={mockGameState}
                onStartNewGame={mockOnStartNewGame}
            />
        );
        
        const input = screen.getByDisplayValue('Is it an animal, mineral, or vegetable?');
        const submitButton = screen.getByText('Ask Question');
        
        fireEvent.change(input, { target: { value: 'Is it bigger than a breadbox?' } });
        fireEvent.click(submitButton);
        
        expect(mockOnAskQuestion).toHaveBeenCalledWith('Is it bigger than a breadbox?');
    });
});
