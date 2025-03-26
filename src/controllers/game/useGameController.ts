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
import { processGameQuestion } from '../../services/gameService';

export interface GameController {
    state: GameState;
    handleQuestion: (question: string) => Promise<void>;
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

const updateStateWithObject = (object: string) =>
    (state: GameState): GameState => ({
        ...state,
        currentObject: object
    });

const resetGameState = () => 
    (): GameState => resetGame();

export const useGameController = (
    onGameComplete: (success: boolean) => void
): GameController => {
    const [state, setState] = useState<GameState>(createInitialState());

    const handleQuestion = useCallback(async (question: string) => {
        try {
            const response = await processGameQuestion(question, state.currentObject);
            
            setState(prevState => {
                let newState = prevState;
                
                if (response.success) {
                    // First update the answer
                    newState = updateStateWithAnswer(response.answer)(newState);
                    
                    // Then add the question with the current answer
                    newState = updateStateWithQuestion(question)(newState);
                    
                    // If this is the first question, update the object
                    if (response.object) {
                        newState = updateStateWithObject(response.object)(newState);
                    }
                } else {
                    // Handle error case
                    newState = updateStateWithAnswer(response.answer)(newState);
                    newState = updateStateWithQuestion(question)(newState);
                }
                
                handleGameCompleteEffect(onGameComplete)(newState);
                return newState;
            });
        } catch (error) {
            setState(prevState => {
                const errorMessage = "Sorry there was an error, please ask your question again.";
                let newState = updateStateWithAnswer(errorMessage)(prevState);
                newState = updateStateWithQuestion(question)(newState);
                handleGameCompleteEffect(onGameComplete)(newState);
                return newState;
            });
        }
    }, [onGameComplete, state.currentObject]);

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