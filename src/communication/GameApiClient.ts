import OpenAI from 'openai';
import { ChatResponse, ApiError } from '../types';

const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

const handleApiError = (error: unknown): ApiError => {
    if (error instanceof Error) {
        return {
            message: error.message,
            code: 'UNKNOWN_ERROR',
            status: 500
        };
    }
    return {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status: 500
    };
};

export const processMessage = async (message: string): Promise<ChatResponse> => {
    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4",
            messages: [{
                role: "user",
                content: message,
            }],
            temperature: 1.5
        });

        const response = completion.choices[0].message.content;
        
        if (!response) {
            throw new Error('No response from OpenAI');
        }

        return {
            message: response,
            success: true
        };
    } catch (error) {
        const apiError = handleApiError(error);
        return {
            message: '',
            success: false,
            error: apiError.message
        };
    }
}; 