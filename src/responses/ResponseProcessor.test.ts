import { processResponse } from './ResponseProcessor';

describe('ResponseProcessor', () => {
    it('should process first question response correctly', () => {
        const response = JSON.stringify({
            object: 'apple',
            answer: 'Yes'
        });
        const result = processResponse(response);
        expect(result).toEqual({
            object: 'apple',
            answer: 'Yes',
            success: true,
            gameStatus: 'ongoing'
        });
    });

    it('should process follow-up question response correctly', () => {
        const response = JSON.stringify({
            answer: 'Yes',
            gameStatus: 'ongoing'
        });
        const result = processResponse(response, 'apple');
        expect(result).toEqual({
            answer: 'Yes',
            success: true,
            gameStatus: 'ongoing'
        });
    });

    it('should handle invalid JSON response', () => {
        const response = 'invalid json';
        const result = processResponse(response);
        expect(result).toEqual({
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Failed to parse response',
            gameStatus: 'ongoing'
        });
    });

    it('should handle invalid response format', () => {
        const response = JSON.stringify({
            answer: 'Yes'
        });
        const result = processResponse(response);
        expect(result).toEqual({
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Failed to parse response',
            gameStatus: 'ongoing'
        });
    });
}); 