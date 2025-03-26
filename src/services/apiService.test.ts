import { processMessage, getChatHistory, clearChatHistory } from './apiService';
import OpenAI from 'openai';

// Mock the OpenAI client
jest.mock('openai', () => {
    const mockCreate = jest.fn();
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: mockCreate
            }
        }
    }));
});

// Get the mock function after the mock is set up
const mockCreate = (new OpenAI() as any).chat.completions.create;

describe('apiService', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('processMessage', () => {
        it('successfully processes a message', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: 'This is a test response'
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const result = await processMessage('Test message');

            expect(result.success).toBe(true);
            expect(result.message).toBe('This is a test response');
            expect(mockCreate).toHaveBeenCalledWith({
                model: "gpt-4",
                messages: [{
                    role: "user",
                    content: "Test message",
                }],
            });
        });

        it('handles empty response from OpenAI', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: null
                    }
                }]
            };

            mockCreate.mockResolvedValueOnce(mockResponse);

            const result = await processMessage('Test message');

            expect(result.success).toBe(false);
            expect(result.error).toBe('No response from OpenAI');
        });

        it('handles API errors', async () => {
            const error = new Error('API Error');
            mockCreate.mockRejectedValueOnce(error);

            const result = await processMessage('Test message');

            expect(result.success).toBe(false);
            expect(result.error).toBe('API Error');
        });
    });

    describe('getChatHistory', () => {
        it('returns empty array', async () => {
            const result = await getChatHistory();
            expect(result).toEqual([]);
        });
    });

    describe('clearChatHistory', () => {
        it('returns true', async () => {
            const result = await clearChatHistory();
            expect(result).toBe(true);
        });
    });
});
