export interface Question {
    text: string;
    answer: string;
    timestamp: Date;
}

export type GameStatus = 'active' | 'complete';

export interface GameState {
    questions: Question[];
    currentAnswer: string;
    currentObject?: string;  // The object being guessed
    gameStatus: GameStatus;
    questionsRemaining: number;
}

export interface GameRules {
    maxQuestions: number;
} 