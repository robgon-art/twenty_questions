import { GameResponse } from '../types';
import { createFirstQuestionPrompt, createFollowUpQuestionPrompt } from '../ai-prompts/ai-prompts';
import { processMessage } from '../communication/GameApiClient';

export const processGameQuestion = async (
    question: string, 
    currentObject?: string,
    usedObjects: string[] = []
): Promise<GameResponse> => {
    try {
        const prompt = currentObject 
            ? createFollowUpQuestionPrompt(currentObject, question)
            : createFirstQuestionPrompt(question, usedObjects);

        const response = await processMessage(prompt);
        
        if (!response.success) {
            console.error('Error from processMessage:', response.error);
            return {
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: response.error,
                gameStatus: 'ongoing'
            };
        }

        try {
            const parsedResponse = JSON.parse(response.message);
            
            if (!currentObject) {
                // First question response
                if (!parsedResponse.object || !parsedResponse.answer) {
                    throw new Error('Invalid response format for first question');
                }
                return {
                    object: parsedResponse.object,
                    answer: parsedResponse.answer,
                    success: true,
                    gameStatus: 'ongoing'
                };
            } else {
                // Follow-up question response
                if (!parsedResponse.answer || !parsedResponse.gameStatus) {
                    throw new Error('Invalid response format for follow-up question');
                }
                return {
                    answer: parsedResponse.answer,
                    success: true,
                    gameStatus: parsedResponse.gameStatus
                };
            }
        } catch (parseError) {
            console.error('Error parsing LLM response:', parseError);
            return {
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: 'Failed to parse LLM response',
                gameStatus: 'ongoing'
            };
        }
    } catch (error) {
        console.error('Unexpected error in processGameQuestion:', error);
        return {
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            gameStatus: 'ongoing'
        };
    }
}; 