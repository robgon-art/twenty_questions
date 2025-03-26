import React, { useState } from 'react';
import styles from './GameInterface.module.css';
import InputField from '../shared/InputField/InputField';
import { GameState } from '../../models/game/types';
import { getQuestionsRemaining } from '../../models/game/rules';

interface GameInterfaceProps {
    onAskQuestion: (question: string) => Promise<void>;
    gameState: GameState;
    onStartNewGame: () => void;
}

const GameHeader: React.FC<{ remaining: number }> = ({ remaining }) => (
    <>
        <h1 className={styles.title}>Twenty Questions</h1>
        <p className={styles.subtitle}>See if you can guess what I am thinking of. Remaining questions: {remaining}</p>
    </>
);

const GameStatus: React.FC<{ remaining: number }> = ({ remaining }) => (
    <p>Questions remaining: {remaining}</p>
);

const GameComplete: React.FC<{ onStartNewGame: () => void }> = ({ onStartNewGame }) => (
    <div className={styles.gameComplete}>
        <p>Game Over!</p>
        <button onClick={onStartNewGame} className={styles.newGameButton}>
            Start New Game
        </button>
    </div>
);

const QuestionItem: React.FC<{ question: GameState['questions'][0], index: number }> = ({ question, index }) => (
    <div className={styles.questionItem}>
        <p className={styles.questionText}>{index + 1}. {question.text}</p>
        <p className={styles.answerText}>{question.answer}</p>
    </div>
);

const QuestionList: React.FC<{ questions: GameState['questions'] }> = ({ questions }) => (
    <div className={styles.questionsList}>
        {[...questions].reverse().map((q, index) => (
            <QuestionItem key={questions.length - 1 - index} question={q} index={questions.length - 1 - index} />
        ))}
    </div>
);

const GameInterface: React.FC<GameInterfaceProps> = ({ 
    onAskQuestion, 
    gameState,
    onStartNewGame 
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (message: string) => {
        setIsLoading(true);
        try {
            await onAskQuestion(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <GameHeader remaining={getQuestionsRemaining(gameState)} />
            {gameState.gameStatus === 'complete' && (
                <GameComplete onStartNewGame={onStartNewGame} />
            )}
            <InputField
                onSubmit={handleSubmit}
                placeholder={isLoading ? "Thinking..." : "Type your question..."}
                disabled={gameState.gameStatus === 'complete' || isLoading}
                buttonText={isLoading ? "Thinking..." : "Ask Question"}
                initialValue="Is it an animal, mineral, or vegetable?"
            />
            <QuestionList questions={gameState.questions} />
        </div>
    );
};

export default GameInterface; 