import { 
    createFirstQuestionPrompt, 
    createFollowUpQuestionPrompt,
    validateFirstQuestionResponse,
    validateFollowUpQuestionResponse
} from './ai-prompts';
import { MAX_QUESTIONS, commonTwentyQuestionsItems } from '../constants';

describe('AI Prompt Manager', () => {
    describe('createFirstQuestionPrompt', () => {
        it('should create a prompt with the question and excluded items', () => {
            const question = 'Is it living?';
            const usedObjects: string[] = [];
            const prompt = createFirstQuestionPrompt(question, usedObjects);
            
            expect(prompt).toContain(MAX_QUESTIONS.toString());
            expect(prompt).toContain(question);
            expect(prompt).toContain(commonTwentyQuestionsItems.join(', '));
        });

        it('should include previously used objects in the prompt', () => {
            const question = 'Is it living?';
            const usedObjects = ['elephant', 'computer'];
            const prompt = createFirstQuestionPrompt(question, usedObjects);
            
            expect(prompt).toContain(MAX_QUESTIONS.toString());
            expect(prompt).toContain(question);
            expect(prompt).toContain(commonTwentyQuestionsItems.join(', '));
            expect(prompt).toContain(usedObjects.join(', '));
        });
    });

    describe('createFollowUpQuestionPrompt', () => {
        it('should create a prompt with the object and question', () => {
            const object = 'elephant';
            const question = 'Is it large?';
            const prompt = createFollowUpQuestionPrompt(object, question);
            
            expect(prompt).toContain(MAX_QUESTIONS.toString());
            expect(prompt).toContain(object);
            expect(prompt).toContain(question);
        });
    });

    describe('validateFirstQuestionResponse', () => {
        it('should validate a valid response', () => {
            const validResponse = {
                object: 'elephant',
                answer: 'yes'
            };
            
            const result = validateFirstQuestionResponse(validResponse);
            expect(result).toEqual({
                object: 'elephant',
                answer: 'yes',
                success: true,
                gameStatus: 'ongoing'
            });
        });

        it('should throw error for invalid response', () => {
            const invalidResponse = {
                answer: 'yes'
            };
            
            expect(() => validateFirstQuestionResponse(invalidResponse))
                .toThrow('Invalid response format for first question');
        });
    });

    describe('validateFollowUpQuestionResponse', () => {
        it('should validate a valid ongoing response', () => {
            const validResponse = {
                answer: 'yes',
                gameStatus: 'ongoing'
            };
            
            const result = validateFollowUpQuestionResponse(validResponse);
            expect(result).toEqual({
                answer: 'yes',
                success: true,
                gameStatus: 'ongoing'
            });
        });

        it('should validate a valid success response', () => {
            const validResponse = {
                answer: 'yes',
                gameStatus: 'success'
            };
            
            const result = validateFollowUpQuestionResponse(validResponse);
            expect(result).toEqual({
                answer: 'yes',
                success: true,
                gameStatus: 'success'
            });
        });

        it('should throw error for invalid response', () => {
            const invalidResponse = {
                answer: 'yes'
            };
            
            expect(() => validateFollowUpQuestionResponse(invalidResponse))
                .toThrow('Invalid response format for follow-up question');
        });
    });
}); 