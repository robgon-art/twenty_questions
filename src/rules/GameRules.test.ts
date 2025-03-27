import { 
    createFirstQuestionPrompt, 
    createFollowUpQuestionPrompt,
    validateFirstQuestionResponse,
    validateFollowUpQuestionResponse
} from './GameRules';
import { MAX_QUESTIONS } from '../constants';

describe('GameRules', () => {
    describe('createFirstQuestionPrompt', () => {
        it('should create correct prompt for first question', () => {
            const question = 'Is it an animal?';
            const prompt = createFirstQuestionPrompt(question);
            expect(prompt).toBe(`We are playing ${MAX_QUESTIONS} questions. Think of a common, well-known thing and answer this first question: ${question}. Return a JSON string with an "object" and "answer" strings.`);
        });
    });

    describe('createFollowUpQuestionPrompt', () => {
        it('should create correct prompt for follow-up question', () => {
            const object = 'apple';
            const question = 'Is it red?';
            const prompt = createFollowUpQuestionPrompt(object, question);
            expect(prompt).toBe(`We are playing ${MAX_QUESTIONS} questions. The object is ${object}. Answer the ${question}. Return a JSON string with an "answer" string and a "gameStatus" field that is either "ongoing" or "success" based on whether the player has correctly guessed the object.`);
        });
    });

    describe('validateFirstQuestionResponse', () => {
        it('should validate correct first question response', () => {
            const response = {
                object: 'apple',
                answer: 'Yes'
            };
            const result = validateFirstQuestionResponse(response);
            expect(result).toEqual({
                object: 'apple',
                answer: 'Yes',
                success: true,
                gameStatus: 'ongoing'
            });
        });

        it('should throw error for invalid first question response', () => {
            const response = {
                answer: 'Yes'
            };
            expect(() => validateFirstQuestionResponse(response)).toThrow('Invalid response format for first question');
        });
    });

    describe('validateFollowUpQuestionResponse', () => {
        it('should validate correct follow-up question response', () => {
            const response = {
                answer: 'Yes',
                gameStatus: 'ongoing'
            };
            const result = validateFollowUpQuestionResponse(response);
            expect(result).toEqual({
                answer: 'Yes',
                success: true,
                gameStatus: 'ongoing'
            });
        });

        it('should throw error for invalid follow-up question response', () => {
            const response = {
                answer: 'Yes'
            };
            expect(() => validateFollowUpQuestionResponse(response)).toThrow('Invalid response format for follow-up question');
        });
    });
}); 