import { GameState, GameRules } from './types';

export const isGameComplete = (state: GameState): boolean => 
    state.gameStatus === 'success' || state.gameStatus === 'failed';

export const canAskQuestion = (state: GameState): boolean => 
    state.gameStatus === 'active' && state.questionsRemaining > 0;

export const getQuestionsRemaining = (state: GameState): number => 
    state.questionsRemaining;

export const getQuestionsAsked = (state: GameState): number => 
    state.questions.length; 