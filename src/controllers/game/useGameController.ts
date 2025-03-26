import { useState, useCallback } from 'react';
import { GameState } from '../../models/game/types';
import {
    createInitialState,
    addQuestion,
    updateAnswer,
    completeGame,
    resetGame
} from '../../models/game/state';
import { isGameComplete } from '../../models/game/rules';

export interface GameController {
    state: GameState;
    handleQuestion: (question: string) => void;
    handleAnswer: (answer: string) => void;
    startNewGame: () => void;
}

// Side effect handlers
const handleGameCompleteEffect = (onGameComplete: (success: boolean) => void) => 
    (state: GameState) => {
        if (isGameComplete(state)) {
            onGameComplete(false);
        }
    };

// State update handlers
const updateStateWithQuestion = (question: string) => 
    (state: GameState): GameState => addQuestion(state, question);

const updateStateWithAnswer = (answer: string) => 
    (state: GameState): GameState => updateAnswer(state, answer);

const resetGameState = () => 
    (): GameState => resetGame();

export const useGameController = (
    onGameComplete: (success: boolean) => void
): GameController => {
    const [state, setState] = useState<GameState>(createInitialState());

    const handleQuestion = useCallback((question: string) => {
        setState(prevState => {
            const newState = updateStateWithQuestion(question)(prevState);
            handleGameCompleteEffect(onGameComplete)(newState);
            return newState;
        });
    }, [onGameComplete]);

    const handleAnswer = useCallback((answer: string) => {
        setState(updateStateWithAnswer(answer));
    }, []);

    const startNewGame = useCallback(() => {
        setState(resetGameState());
    }, []);

    return {
        state,
        handleQuestion,
        handleAnswer,
        startNewGame
    };
}; 