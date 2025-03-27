import { GameResponse } from '../types';
import { validateFirstQuestionResponse, validateFollowUpQuestionResponse } from '../rules/AIPromptManager';

export const processResponse = (response: string, currentObject?: string): GameResponse => {
    try {
        const parsedResponse = JSON.parse(response);
        
        if (!currentObject) {
            return validateFirstQuestionResponse(parsedResponse);
        } else {
            return validateFollowUpQuestionResponse(parsedResponse);
        }
    } catch (parseError) {
        console.error('Error parsing response:', parseError);
        return {
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: 'Failed to parse response',
            gameStatus: 'ongoing'
        };
    }
}; 