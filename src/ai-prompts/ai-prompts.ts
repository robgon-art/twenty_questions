import { MAX_QUESTIONS, commonTwentyQuestionsItems } from '../constants';
import { GameResponse } from '../types';

export const createFirstQuestionPrompt = (question: string, usedObjects: string[]): string =>
    `We are playing ${MAX_QUESTIONS} questions. 
Think of a common, well-known thing and answer this first question: ${question}. 
Please avoid these common items: ${commonTwentyQuestionsItems.join(', ')}. 
Also avoid these previously used items: ${usedObjects.join(', ')}. 
Return a JSON string with an "object" and "answer" strings.`;

export const createFollowUpQuestionPrompt = (object: string, question: string): string =>
    `We are playing ${MAX_QUESTIONS} questions. 
The object is ${object}. 
Answer the ${question}.
Answer with "yes" or "no". Qualify the answer briefly, in necessary.
Never refer to the object by name. This would spoil the game for the user.
Return a JSON string with an "answer" string and a "gameStatus" field that is either "ongoing" or "success"
based on whether the player has correctly guessed the object.
Only answer "yes" if the user guesses the object correctly, and gameStatus it set to "success"
`;

export const validateFirstQuestionResponse = (parsedResponse: any): GameResponse => {
    if (!parsedResponse.object || !parsedResponse.answer) {
        throw new Error('Invalid response format for first question');
    }
    return {
        object: parsedResponse.object,
        answer: parsedResponse.answer,
        success: true,
        gameStatus: 'ongoing'
    };
};

export const validateFollowUpQuestionResponse = (parsedResponse: any): GameResponse => {
    if (!parsedResponse.answer || !parsedResponse.gameStatus) {
        throw new Error('Invalid response format for follow-up question');
    }
    return {
        answer: parsedResponse.answer,
        success: true,
        gameStatus: parsedResponse.gameStatus
    };
}; 