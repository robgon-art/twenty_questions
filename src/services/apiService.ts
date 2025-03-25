export interface ChatMessage {
    id: string;
    text: string;
    timestamp: Date;
    isUser: boolean;
}

export interface ChatResponse {
    message: string;
    success: boolean;
}

export const processMessage = async (message: string): Promise<ChatResponse> => {
    // We'll implement the actual API call here
    return {
        message: 'Response placeholder',
        success: true
    };
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
    // We'll implement chat history retrieval here
    return [];
};
