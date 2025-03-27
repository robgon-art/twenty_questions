import { processGameQuestion } from './QuestionProcessor';
import { processMessage } from '../communication/GameApiClient';

// Mock the API client
jest.mock('../communication/GameApiClient');

describe('QuestionProcessor', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should process first question correctly', async () => {
        const mockResponse = {
            success: true,
            message: JSON.stringify({
                object: 'apple',
                answer: 'Yes'
            })
        };
        (processMessage as jest.Mock).mockResolvedValue(mockResponse);

        const result = await processGameQuestion('Is it an animal?');

        expect(result).toEqual({
            object: 'apple',
            answer: 'Yes',
            success: true,
            gameStatus: 'ongoing'
        });
        expect(processMessage).toHaveBeenCalledTimes(1);
    });

    it('should process follow-up question correctly', async () => {
        const mockResponse = {
            success: true,
            message: JSON.stringify({
                answer: 'Yes',
                gameStatus: 'ongoing'
            })
        };
        (processMessage as jest.Mock).mockResolvedValue(mockResponse);

        const result = await processGameQuestion('Is it red?', 'apple');

        expect(result).toEqual({
            answer: 'Yes',
            success: true,
            gameStatus: 'ongoing'
        });
        expect(processMessage).toHaveBeenCalledTimes(1);
    });

    it('should handle API error', async () => {
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

    it('should handle invalid response format', async () => {
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
}); 