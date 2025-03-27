import { processMessage } from './GameApiClient';
import OpenAI from 'openai';

// Mock the OpenAI module
jest.mock('openai', () => {
    // Create the mock inside the mock factory
    const mockCreate = jest.fn();
    
    return {
        __esModule: true,
        default: class MockOpenAI {
            chat = {
                completions: {
                    create: mockCreate
                }
            };
        }
    };
});

// Get access to the mock function
const getMockCreate = () => {
    const OpenAIInstance = new (OpenAI as any)();
    return OpenAIInstance.chat.completions.create as jest.Mock;
};

describe('GameApiClient', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('processMessage', () => {
        it('should return a successful response when API call succeeds', async () => {
            // Arrange
            const testMessage = 'Hello, world!';
            const mockResponse = 'This is a test response';
            
            const mockCreate = getMockCreate();
            mockCreate.mockResolvedValueOnce({
                choices: [
                    {
                        message: {
                            content: mockResponse
                        }
                    }
                ]
            });

            // Act
            const result = await processMessage(testMessage);

            // Assert
            expect(mockCreate).toHaveBeenCalledWith({
                model: "gpt-4",
                messages: [
                    {
                        role: "user",
                        content: testMessage
                    }
                ]
            });
            expect(result).toEqual({
                message: mockResponse,
                success: true
            });
        });

        it('should return an error response when API call fails', async () => {
            // Arrange
            const testMessage = 'Hello, world!';
            const mockError = new Error('API Error');
            
            const mockCreate = getMockCreate();
            mockCreate.mockRejectedValueOnce(mockError);

            // Act
            const result = await processMessage(testMessage);

            // Assert
            expect(result).toEqual({
                message: '',
                success: false,
                error: 'API Error'
            });
        });

        it('should return an error response when API returns no content', async () => {
            // Arrange
            const testMessage = 'Hello, world!';
            
            const mockCreate = getMockCreate();
            mockCreate.mockResolvedValueOnce({
                choices: [
                    {
                        message: {
                            content: null
                        }
                    }
                ]
            });

            // Act
            const result = await processMessage(testMessage);

            // Assert
            expect(result).toEqual({
                message: '',
                success: false,
                error: 'No response from OpenAI'
            });
        });
    });

    // Additional test to verify error handling with non-Error objects
    it('should handle non-Error objects in error handler', async () => {
        // Arrange
        const testMessage = 'Hello, world!';
        
        const mockCreate = getMockCreate();
        // Using a string as an error (non-Error object)
        mockCreate.mockRejectedValueOnce('String error');

        // Act
        const result = await processMessage(testMessage);

        // Assert
        expect(result).toEqual({
            message: '',
            success: false,
            error: 'An unexpected error occurred'
        });
    });
});
