import { processGameQuestion } from './gameService';
import { processMessage } from './apiService';

// Mock the apiService
jest.mock('./apiService', () => ({
    processMessage: jest.fn()
}));

describe('gameService', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('processGameQuestion - first question', () => {
        it('should handle successful first question response', async () => {
            const mockResponse = {
                success: true,
                message: JSON.stringify({
                    object: 'elephant',
                    answer: 'yes'
                })
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it an animal?');

            expect(result).toEqual({
                object: 'elephant',
                answer: 'yes',
                success: true,
                gameStatus: 'ongoing'
            });
            expect(processMessage).toHaveBeenCalledTimes(1);
        });

        it('should handle API error for first question', async () => {
            const mockResponse = {
                success: false,
                error: 'API Error'
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it an animal?');

            expect(result).toEqual({
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: 'API Error',
                gameStatus: 'ongoing'
            });
        });

        it('should handle invalid JSON response for first question', async () => {
            const mockResponse = {
                success: true,
                message: 'invalid json'
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it an animal?');

            expect(result).toEqual({
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: 'Failed to parse LLM response',
                gameStatus: 'ongoing'
            });
        });

        it('should handle missing required fields in first question response', async () => {
            const mockResponse = {
                success: true,
                message: JSON.stringify({
                    answer: 'yes'
                })
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it an animal?');

            expect(result).toEqual({
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: 'Failed to parse LLM response',
                gameStatus: 'ongoing'
            });
        });
    });

    describe('processGameQuestion - follow-up question', () => {
        it('should handle successful follow-up question response', async () => {
            const mockResponse = {
                success: true,
                message: JSON.stringify({
                    answer: 'yes',
                    gameStatus: 'ongoing'
                })
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it large?', 'elephant');

            expect(result).toEqual({
                answer: 'yes',
                success: true,
                gameStatus: 'ongoing'
            });
            expect(processMessage).toHaveBeenCalledTimes(1);
        });

        it('should handle successful game completion', async () => {
            const mockResponse = {
                success: true,
                message: JSON.stringify({
                    answer: 'yes',
                    gameStatus: 'success'
                })
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it an elephant?', 'elephant');

            expect(result).toEqual({
                answer: 'yes',
                success: true,
                gameStatus: 'success'
            });
        });

        it('should handle API error for follow-up question', async () => {
            const mockResponse = {
                success: false,
                error: 'API Error'
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it large?', 'elephant');

            expect(result).toEqual({
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: 'API Error',
                gameStatus: 'ongoing'
            });
        });

        it('should handle missing required fields in follow-up question response', async () => {
            const mockResponse = {
                success: true,
                message: JSON.stringify({
                    answer: 'yes'
                })
            };
            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it large?', 'elephant');

            expect(result).toEqual({
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: 'Failed to parse LLM response',
                gameStatus: 'ongoing'
            });
        });
    });
}); 