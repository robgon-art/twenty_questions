import { processMessage } from './apiService';

export interface GameResponse {
    object?: string;
    answer: string;
    success: boolean;
    error?: string;
    gameStatus: 'ongoing' | 'success';
}

const FIRST_QUESTION_PROMPT = (question: string) => 
    `We are playing twenty questions. Think of a common, well-known thing and answer this first question: ${question}. Return a JSON string with an "object" and "answer" strings.`;

const FOLLOW_UP_QUESTION_PROMPT = (object: string, question: string) =>
    `We are playing twenty questions. The object is ${object}. Answer the ${question}. Return a JSON string with an "answer" string and a "gameStatus" field that is either "ongoing" or "success" based on whether the player has correctly guessed the object.`;

export const processGameQuestion = async (question: string, currentObject?: string): Promise<GameResponse> => {
    try {
        const prompt = currentObject 
            ? FOLLOW_UP_QUESTION_PROMPT(currentObject, question)
            : FIRST_QUESTION_PROMPT(question);

        const response = await processMessage(prompt);
        
        if (!response.success) {
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
            return {
                answer: "Sorry there was an error, please ask your question again.",
                success: false,
                error: 'Failed to parse LLM response',
                gameStatus: 'ongoing'
            };
        }
    } catch (error) {
        return {
            answer: "Sorry there was an error, please ask your question again.",
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            gameStatus: 'ongoing'
        };
    }
}; 