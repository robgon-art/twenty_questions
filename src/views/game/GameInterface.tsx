import React from 'react';
import styles from './GameInterface.module.css';
import InputField from '../shared/InputField/InputField';
import { GameState } from '../../models/game/types';
import { getQuestionsRemaining } from '../../models/game/rules';

interface GameInterfaceProps {
    onAskQuestion: (question: string) => void;
    gameState: GameState;
    onStartNewGame: () => void;
}

const GameHeader: React.FC = () => (
    <>
        <h1 className={styles.title}>Twenty Questions</h1>
        <p className={styles.subtitle}>See if you can guess what I am thinking of.</p>
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

const QuestionItem: React.FC<{ question: GameState['questions'][0] }> = ({ question }) => (
    <div className={styles.questionItem}>
        <p className={styles.questionText}>{question.text}</p>
        <p className={styles.answerText}>{question.answer}</p>
    </div>
);

const QuestionList: React.FC<{ questions: GameState['questions'] }> = ({ questions }) => (
    <div className={styles.questionsList}>
        {questions.map((q, index) => (
            <QuestionItem key={index} question={q} />
        ))}
    </div>
);

const GameInfo: React.FC<{
    gameState: GameState;
    onStartNewGame: () => void;
}> = ({ gameState, onStartNewGame }) => (
    <div className={styles.gameInfo}>
        <GameStatus remaining={getQuestionsRemaining(gameState)} />
        {gameState.gameStatus === 'complete' && (
            <GameComplete onStartNewGame={onStartNewGame} />
        )}
    </div>
);

const GameInterface: React.FC<GameInterfaceProps> = ({ 
    onAskQuestion, 
    gameState,
    onStartNewGame 
}) => {
    const handleSubmit = (message: string) => {
        onAskQuestion(message);
    };

    return (
        <div className={styles.container}>
            <GameHeader />
            <GameInfo gameState={gameState} onStartNewGame={onStartNewGame} />
            <QuestionList questions={gameState.questions} />
            <InputField
                onSubmit={handleSubmit}
                placeholder="Type your question..."
                disabled={gameState.gameStatus === 'complete'}
                buttonText="Ask Question"
                initialValue="Is it an animal, mineral, or vegetable?"
            />
        </div>
    );
};

export default GameInterface; 