export interface Question {
    text: string;
    answer: string;
    timestamp: Date;
}

export type GameStatus = 'active' | 'success' | 'failed';

export interface GameState {
    questions: Question[];
    currentAnswer: string;
    currentObject?: string;  // The object being guessed
    gameStatus: GameStatus;
    questionsRemaining: number;
    usedObjects: string[];  // Track objects that have been used in previous games
}

export interface GameRules {
    maxQuestions: number;
} 