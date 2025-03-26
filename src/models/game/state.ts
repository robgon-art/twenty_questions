import { GameState, Question, GameRules } from './types';

const DEFAULT_RULES: GameRules = {
    maxQuestions: 20
};

// Pure functions for state transformations
const createQuestion = (text: string, answer: string): Question => ({
    text,
    answer,
    timestamp: new Date()
});

const decrementQuestions = (count: number): number => count - 1;
const shouldCompleteGame = (remaining: number): boolean => remaining <= 0;

const updateQuestions = (questions: Question[], newQuestion: Question): Question[] => 
    [...questions, newQuestion];

const updateGameStatus = (remaining: number): 'active' | 'complete' => 
    shouldCompleteGame(remaining) ? 'complete' : 'active';

// Main state transformation functions
export const createInitialState = (rules: GameRules = DEFAULT_RULES): GameState => ({
    questions: [],
    currentAnswer: '',
    currentObject: undefined,
    gameStatus: 'active',
    questionsRemaining: rules.maxQuestions
});

export const addQuestion = (state: GameState, questionText: string): GameState => {
    if (state.gameStatus !== 'active') return state;

    const newQuestion = createQuestion(questionText, state.currentAnswer);
    const newQuestionsRemaining = decrementQuestions(state.questionsRemaining);
    const newGameStatus = updateGameStatus(newQuestionsRemaining);

    return {
        ...state,
        questions: updateQuestions(state.questions, newQuestion),
        questionsRemaining: newQuestionsRemaining,
        gameStatus: newGameStatus
    };
};

export const updateAnswer = (state: GameState, answer: string): GameState => ({
    ...state,
    currentAnswer: answer
});

export const updateObject = (state: GameState, object: string): GameState => ({
    ...state,
    currentObject: object
});

export const completeGame = (state: GameState, success: boolean): GameState => ({
    ...state,
    gameStatus: 'complete'
});

export const resetGame = (rules: GameRules = DEFAULT_RULES): GameState => 
    createInitialState(rules); 