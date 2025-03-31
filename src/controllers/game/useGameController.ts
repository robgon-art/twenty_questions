import { useState, useCallback } from 'react';
import { GameState } from '../../models/game/types';
import {
    createInitialState,
    addQuestion,
    updateAnswer,
    updateObject,
    resetGame
} from '../../models/game/state';
import { processGameQuestion } from '../../questions/QuestionProcessor';

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export interface GameController {
    state: GameState;
    handleQuestion: (question: string) => Promise<void>;
    handleAnswer: (answer: string) => void;
    startNewGame: () => void;
}

// State update handlers
const updateStateWithQuestion = (question: string) => 
    (state: GameState): GameState => addQuestion(state, question);

const updateStateWithAnswer = (answer: string) => 
    (state: GameState): GameState => updateAnswer(state, answer);

const updateStateWithObject = (object: string) =>
    (state: GameState): GameState => updateObject(state, object);

const resetGameState = () => 
    (): GameState => resetGame();

export const useGameController = (): GameController => {
    const [state, setState] = useState<GameState>(createInitialState());

    const handleQuestion = useCallback(async (question: string) => {
        try {
            const response = await processGameQuestion(
                question, 
                state.currentObject,
                state.usedObjects
            );
            
            setState(prevState => {
                let newState = prevState;
                
                if (response.success) {
                    // First update the answer with capitalized first letter
                    newState = updateStateWithAnswer(capitalizeFirstLetter(response.answer))(newState);
                    
                    // Then add the question with the current answer
                    newState = updateStateWithQuestion(question)(newState);
                    
                    // If this is the first question, update the object
                    if (response.object) {
                        newState = updateStateWithObject(response.object)(newState);
                    }

                    // Update game status based on LLM response and questions remaining
                    if (response.gameStatus === 'success') {
                        newState = {
                            ...newState,
                            gameStatus: 'success'
                        };
                    } else if (newState.questionsRemaining <= 0) {
                        // If we've exhausted all questions, set to failed
                        newState = {
                            ...newState,
                            gameStatus: 'failed'
                        };
                    }
                } else {
                    // Handle error case
                    newState = updateStateWithAnswer(capitalizeFirstLetter(response.answer))(newState);
                    newState = updateStateWithQuestion(question)(newState);
                }
                
                return newState;
            });
        } catch (error) {
            setState(prevState => {
                const errorMessage = "Sorry there was an error, please ask your question again.";
                let newState = updateStateWithAnswer(errorMessage)(prevState);
                newState = updateStateWithQuestion(question)(newState);
                return newState;
            });
        }
    }, [state.currentObject, state.usedObjects]);

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