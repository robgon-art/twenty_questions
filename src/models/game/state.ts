import { GameState, Question, GameRules } from './types';
import { MAX_QUESTIONS } from '../../constants';

const DEFAULT_RULES: GameRules = {
    maxQuestions: MAX_QUESTIONS
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

const updateGameStatus = (remaining: number): 'active' | 'failed' => 
    shouldCompleteGame(remaining) ? 'failed' : 'active';

const addUsedObject = (usedObjects: string[], newObject: string): string[] => 
    usedObjects.includes(newObject) ? usedObjects : [...usedObjects, newObject];

// Main state transformation functions
export const createInitialState = (rules: GameRules = DEFAULT_RULES): GameState => ({
    questions: [],
    currentAnswer: '',
    currentObject: undefined,
    gameStatus: 'active',
    questionsRemaining: rules.maxQuestions,
    usedObjects: []
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
    currentObject: object,
    usedObjects: addUsedObject(state.usedObjects, object)
});

export const completeGame = (state: GameState, success: boolean): GameState => ({
    ...state,
    gameStatus: success ? 'success' : 'failed'
});

export const resetGame = (rules: GameRules = DEFAULT_RULES): GameState => 
    createInitialState(rules); 