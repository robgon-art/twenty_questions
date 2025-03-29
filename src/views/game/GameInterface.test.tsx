import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import GameInterface from './GameInterface';
import { GameState } from '../../models/game/types';
import { MAX_QUESTIONS } from '../../constants';

// Mock the CSS module
jest.mock('./GameInterface.module.css', () => ({
    container: 'container',
    title: 'title',
    subtitle: 'subtitle',
    questionItem: 'questionItem',
    questionText: 'questionText',
    questionsList: 'questionsList'
}));

describe('GameInterface', () => {
    const mockOnAskQuestion = jest.fn();
    const mockOnStartNewGame = jest.fn();

    const createGameState = (overrides: Partial<GameState> = {}): GameState => ({
        questions: [],
        currentAnswer: '',
        currentObject: undefined,
        gameStatus: 'active',
        questionsRemaining: MAX_QUESTIONS,
        usedObjects: [],
        ...overrides
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders initial game state correctly', () => {
        const gameState = createGameState();
        act(() => {
            render(<GameInterface onAskQuestion={mockOnAskQuestion} gameState={gameState} onStartNewGame={mockOnStartNewGame} />);
        });

        // Use a more flexible text matcher for the title
        expect(screen.getByText((content, element) => {
            return (element?.tagName.toLowerCase() === 'h1') &&
                (element.textContent?.includes('Twenty Questions') ?? false);
        })).toBeInTheDocument();

        expect(screen.getByText(`See if you can guess what I am thinking of. Remaining questions: ${MAX_QUESTIONS}`)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type your question...')).toBeInTheDocument();
        expect(screen.getByText('Ask Question')).toBeInTheDocument();
    });

    it('handles question submission correctly', async () => {
        const gameState = createGameState();
        render(<GameInterface onAskQuestion={mockOnAskQuestion} gameState={gameState} onStartNewGame={mockOnStartNewGame} />);

        const input = screen.getByPlaceholderText('Type your question...');
        const button = screen.getByText('Ask Question');

        fireEvent.change(input, { target: { value: 'Is it an animal?' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockOnAskQuestion).toHaveBeenCalledWith('Is it an animal?');
        });
    });

    it('shows loading state while processing question', async () => {
        const gameState = createGameState();
        mockOnAskQuestion.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

        render(<GameInterface onAskQuestion={mockOnAskQuestion} gameState={gameState} onStartNewGame={mockOnStartNewGame} />);

        const input = screen.getByPlaceholderText('Type your question...');
        const button = screen.getByText('Ask Question');

        fireEvent.change(input, { target: { value: 'Is it an animal?' } });
        fireEvent.click(button);

        expect(screen.getByText('Thinking...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Ask Question')).toBeInTheDocument();
        });
    });

    it('displays questions list correctly', () => {
        const gameState = createGameState({
            questions: [
                { text: 'Is it an animal?', answer: 'Yes', timestamp: new Date() },
                { text: 'Is it large?', answer: 'No', timestamp: new Date() }
            ]
        });

        render(<GameInterface onAskQuestion={mockOnAskQuestion} gameState={gameState} onStartNewGame={mockOnStartNewGame} />);

        // Check for questions and answers using a more specific selector
        const questionElements = screen.getAllByText((content, element) => {
            return Boolean(element?.classList.contains('questionText') &&
                element.textContent?.includes('2. Is it large?'));
        });
        expect(questionElements.length).toBe(1);

        expect(screen.getByText('No')).toBeInTheDocument();

        const firstQuestionElements = screen.getAllByText((content, element) => {
            return Boolean(element?.classList.contains('questionText') &&
                element.textContent?.includes('1. Is it an animal?'));
        });
        expect(firstQuestionElements.length).toBe(1);

        expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('shows success state correctly', () => {
        const gameState = createGameState({
            gameStatus: 'success',
            questionsRemaining: MAX_QUESTIONS - 2
        });

        render(<GameInterface onAskQuestion={mockOnAskQuestion} gameState={gameState} onStartNewGame={mockOnStartNewGame} />);

        expect(screen.getByText(`You win! 🎉 You got it correct in 2 questions.`)).toBeInTheDocument();
        expect(screen.getByText('Play Again')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Click Play Again to start over')).toBeInTheDocument();
    });

    it('shows failure state correctly', () => {
        const gameState = createGameState({
            gameStatus: 'failed',
            currentObject: 'elephant'
        });

        render(<GameInterface onAskQuestion={mockOnAskQuestion} gameState={gameState} onStartNewGame={mockOnStartNewGame} />);

        expect(screen.getByText((content, element) => {
            return Boolean(element?.classList.contains('subtitle') && 
                element.textContent?.includes('You lose. 😢 The answer was elephant'));
        })).toBeInTheDocument();
        expect(screen.getByText('Play Again')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Click Play Again to start over')).toBeInTheDocument();
    });

    it('starts new game when clicking Play Again', () => {
        const gameState = createGameState({
            gameStatus: 'success'
        });

        render(<GameInterface onAskQuestion={mockOnAskQuestion} gameState={gameState} onStartNewGame={mockOnStartNewGame} />);

        const button = screen.getByText('Play Again');
        fireEvent.click(button);

        expect(mockOnStartNewGame).toHaveBeenCalled();
    });
}); 