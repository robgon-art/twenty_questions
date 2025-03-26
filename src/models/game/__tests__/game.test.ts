import { GameState } from '../types';
import { createInitialState, addQuestion, updateAnswer, updateObject, resetGame } from '../state';
import { isGameComplete, canAskQuestion, getQuestionsRemaining, getQuestionsAsked } from '../rules';
import { MAX_QUESTIONS } from '../../../constants';

describe('Game State Management', () => {
    let initialState: GameState;

    beforeEach(() => {
        initialState = createInitialState();
    });

    describe('Initial State', () => {
        it('should create initial state with correct values', () => {
            expect(initialState.questions).toHaveLength(0);
            expect(initialState.currentAnswer).toBe('');
            expect(initialState.currentObject).toBeUndefined();
            expect(initialState.gameStatus).toBe('active');
            expect(initialState.questionsRemaining).toBe(MAX_QUESTIONS);
        });
    });

    describe('Question Management', () => {
        it('should add a question and update remaining count', () => {
            const state = addQuestion(initialState, 'Is it an animal?');
            
            expect(state.questions).toHaveLength(1);
            expect(state.questions[0].text).toBe('Is it an animal?');
            expect(state.questionsRemaining).toBe(MAX_QUESTIONS - 1);
        });

        it('should not add questions when game is not active', () => {
            const inactiveState = { ...initialState, gameStatus: 'success' as const };
            const state = addQuestion(inactiveState, 'Is it an animal?');
            
            expect(state.questions).toHaveLength(0);
        });
    });

    describe('Answer Management', () => {
        it('should update current answer', () => {
            const state = updateAnswer(initialState, 'Yes');
            expect(state.currentAnswer).toBe('Yes');
        });
    });

    describe('Object Management', () => {
        it('should update current object', () => {
            const state = updateObject(initialState, 'apple');
            expect(state.currentObject).toBe('apple');
        });
    });

    describe('Game Rules', () => {
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

    describe('Game Reset', () => {
        it('should reset game to initial state', () => {
            const modifiedState = {
                ...initialState,
                questions: [{ text: 'Is it an animal?', answer: 'Yes', timestamp: new Date() }],
                currentAnswer: 'Yes',
                currentObject: 'apple',
                gameStatus: 'success' as const,
                questionsRemaining: MAX_QUESTIONS - 5
            };

            const resetState = resetGame();
            expect(resetState).toEqual(initialState);
        });
    });
}); 