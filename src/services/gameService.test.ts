import { processGameQuestion } from './gameService';
import { processMessage } from './apiService';

// Mock the apiService
jest.mock('./apiService');

describe('gameService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('processGameQuestion', () => {
        it('should handle first question correctly', async () => {
            const mockResponse = {
                message: JSON.stringify({
                    object: 'elephant',
                    answer: 'Yes, it is an animal'
                }),
                success: true
            };

            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it an animal?');

            expect(result.success).toBe(true);
            expect(result.object).toBe('elephant');
            expect(result.answer).toBe('Yes, it is an animal');
            expect(processMessage).toHaveBeenCalledWith(
                expect.stringContaining('Think of a common, well-known thing')
            );
        });

        it('should handle follow-up questions correctly', async () => {
            const mockResponse = {
                message: JSON.stringify({
                    answer: 'Yes, it is large'
                }),
                success: true
            };

            (processMessage as jest.Mock).mockResolvedValue(mockResponse);

            const result = await processGameQuestion('Is it large?', 'elephant');

            expect(result.success).toBe(true);
            expect(result.object).toBeUndefined();
            expect(result.answer).toBe('Yes, it is large');
            expect(processMessage).toHaveBeenCalledWith(
                expect.stringContaining('The object is elephant')
            );
        });

        it('should handle API errors gracefully', async () => {
            (processMessage as jest.Mock).mockResolvedValue({
                message: '',
                success: false,
                error: 'API Error'
            });

            const result = await processGameQuestion('Is it an animal?');

            expect(result.success).toBe(false);
            expect(result.answer).toBe('Sorry there was an error, please ask your question again.');
            expect(result.error).toBe('API Error');
        });

        it('should handle invalid JSON responses gracefully', async () => {
            (processMessage as jest.Mock).mockResolvedValue({
                message: 'Invalid JSON',
                success: true
            });

            const result = await processGameQuestion('Is it an animal?');

            expect(result.success).toBe(false);
            expect(result.answer).toBe('Sorry there was an error, please ask your question again.');
            expect(result.error).toBe('Failed to parse LLM response');
        });
    });
}); 