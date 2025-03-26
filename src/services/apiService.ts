import OpenAI from 'openai';

export interface ChatMessage {
    id: string;
    text: string;
    timestamp: Date;
    isUser: boolean;
}

export interface ChatResponse {
    message: string;
    success: boolean;
    error?: string;
}

export interface ApiError {
    message: string;
    code: string;
    status: number;
}

// Log to verify API key is available (remove in production)
console.log('OpenAI API Key available:', !!process.env.REACT_APP_OPENAI_API_KEY);

const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Required for testing in browser environment
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

export const getChatHistory = async (): Promise<ChatMessage[]> => {
    // Since OpenAI doesn't maintain chat history, we'll return an empty array
    // In a real application, you might want to maintain history in your own database
    return [];
};

export const clearChatHistory = async (): Promise<boolean> => {
    // Since we're not maintaining history, this is always successful
    return true;
};
