export interface GameResponse {
    object?: string;
    answer: string;
    success: boolean;
    error?: string;
    gameStatus: 'ongoing' | 'success';
}

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