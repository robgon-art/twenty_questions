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

    it('should handle first question with missing object', async () => {
        const mockResponse = {
            success: true,
            message: JSON.stringify({
                answer: 'Yes'
            })
        };
        (processMessage as jest.Mock).mockResolvedValue(mockResponse);

        const result = await processGameQuestion('Is it an animal?');

        expect(result).toEqual({
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Invalid response format for first question',
            gameStatus: 'ongoing'
        });
    });

    it('should handle follow-up question with missing answer', async () => {
        const mockResponse = {
            success: true,
            message: JSON.stringify({
                gameStatus: 'ongoing'
            })
        };
        (processMessage as jest.Mock).mockResolvedValue(mockResponse);

        const result = await processGameQuestion('Is it red?', 'apple');

        expect(result).toEqual({
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Invalid response format for follow-up question',
            gameStatus: 'ongoing'
        });
    });

    it('should handle follow-up question with missing gameStatus', async () => {
        const mockResponse = {
            success: true,
            message: JSON.stringify({
                answer: 'Yes'
            })
        };
        (processMessage as jest.Mock).mockResolvedValue(mockResponse);

        const result = await processGameQuestion('Is it red?', 'apple');

        expect(result).toEqual({
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Invalid response format for follow-up question',
            gameStatus: 'ongoing'
        });
    });

    it('should handle unexpected error', async () => {
        (processMessage as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

        const result = await processGameQuestion('Is it an animal?');

        expect(result).toEqual({
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Unexpected error',
            gameStatus: 'ongoing'
        });
    });

    it('should handle non-Error unexpected error', async () => {
        (processMessage as jest.Mock).mockRejectedValue('String error');

        const result = await processGameQuestion('Is it an animal?');

        expect(result).toEqual({
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Unknown error occurred',
            gameStatus: 'ongoing'
        });
    });

    it('should handle success game status in follow-up question', async () => {
        const mockResponse = {
            success: true,
            message: JSON.stringify({
                answer: 'Yes',
                gameStatus: 'success'
            })
        };
        (processMessage as jest.Mock).mockResolvedValue(mockResponse);

        const result = await processGameQuestion('Is it red?', 'apple');

        expect(result).toEqual({
            answer: 'Yes',
            success: true,
            gameStatus: 'success'
        });
    });

    it('should handle failed game status in follow-up question', async () => {
        const mockResponse = {
            success: true,
            message: JSON.stringify({
                answer: 'No',
                gameStatus: 'failed'
            })
        };
        (processMessage as jest.Mock).mockResolvedValue(mockResponse);

        const result = await processGameQuestion('Is it red?', 'apple');

        expect(result).toEqual({
            answer: 'No',
            success: true,
            gameStatus: 'failed'
        });
    });
}); 