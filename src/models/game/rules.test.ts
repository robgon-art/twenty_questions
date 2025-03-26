import { GameState } from './types';
import { createInitialState, addQuestion } from './state';
import { isGameComplete, canAskQuestion, getQuestionsRemaining, getQuestionsAsked } from './rules';
import { MAX_QUESTIONS } from '../../constants';

describe('Game Rules', () => {
    let initialState: GameState;

    beforeEach(() => {
        initialState = createInitialState();
    });

    it('should correctly identify game completion', () => {
        expect(isGameComplete(initialState)).toBe(false);
        
        const successState = { ...initialState, gameStatus: 'success' as const };
        expect(isGameComplete(successState)).toBe(true);
        
        const failedState = { ...initialState, gameStatus: 'failed' as const };
        expect(isGameComplete(failedState)).toBe(true);
    });

    it('should correctly determine if questions can be asked', () => {
        expect(canAskQuestion(initialState)).toBe(true);
        
        const noQuestionsLeft = { ...initialState, questionsRemaining: 0 };
        expect(canAskQuestion(noQuestionsLeft)).toBe(false);
        
        const successState = { ...initialState, gameStatus: 'success' as const };
        expect(canAskQuestion(successState)).toBe(false);
        
        const failedState = { ...initialState, gameStatus: 'failed' as const };
        expect(canAskQuestion(failedState)).toBe(false);
    });

    it('should correctly track questions remaining', () => {
        expect(getQuestionsRemaining(initialState)).toBe(MAX_QUESTIONS);
        
        const state = addQuestion(initialState, 'Is it an animal?');
        expect(getQuestionsRemaining(state)).toBe(MAX_QUESTIONS - 1);
    });

    it('should correctly track questions asked', () => {
        expect(getQuestionsAsked(initialState)).toBe(0);
        
        const state = addQuestion(initialState, 'Is it an animal?');
        expect(getQuestionsAsked(state)).toBe(1);
    });
}); 