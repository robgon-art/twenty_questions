export interface Question {
    text: string;
    answer: string;
    timestamp: Date;
}

export type GameStatus = 'active' | 'complete';

export interface GameState {
    questions: Question[];
    currentAnswer: string;
    gameStatus: GameStatus;
    questionsRemaining: number;
}

export interface GameRules {
    maxQuestions: number;
} 