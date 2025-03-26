import React, { useState } from 'react';

export interface Question {
    text: string;
    answer: string;
    timestamp: Date;
}

export interface GameState {
    questions: Question[];
    currentAnswer: string;
    gameStatus: 'active' | 'complete';
    questionsRemaining: number;
}

export interface GameStateHook {
    state: GameState;
    handleQuestion: (questionText: string) => void;
    handleAnswer: (answer: string) => void;
    startNewGame: () => void;
}

const MAX_QUESTIONS = 20;

export const useGameState = (onGameComplete: (success: boolean) => void): GameStateHook => {
    const [state, setState] = useState<GameState>({
        questions: [],
        currentAnswer: '',
        gameStatus: 'active',
        questionsRemaining: MAX_QUESTIONS
    });

    const handleQuestion = (questionText: string) => {
        if (state.gameStatus !== 'active') return;

        const newQuestion: Question = {
            text: questionText,
            answer: state.currentAnswer,
            timestamp: new Date()
        };

        setState(prev => {
            const newQuestions = [...prev.questions, newQuestion];
            const newQuestionsRemaining = prev.questionsRemaining - 1;
            
            if (newQuestionsRemaining <= 0) {
                onGameComplete(false); // Player didn't guess correctly
                return {
                    ...prev,
                    questions: newQuestions,
                    questionsRemaining: 0,
                    gameStatus: 'complete'
                };
            }

            return {
                ...prev,
                questions: newQuestions,
                questionsRemaining: newQuestionsRemaining
            };
        });
    };

    const handleAnswer = (answer: string) => {
        setState(prev => ({
            ...prev,
            currentAnswer: answer
        }));
    };

    const startNewGame = () => {
        setState({
            questions: [],
            currentAnswer: '',
            gameStatus: 'active',
            questionsRemaining: MAX_QUESTIONS
        });
    };

    return {
        state,
        handleQuestion,
        handleAnswer,
        startNewGame
    };
}; 