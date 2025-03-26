import React from 'react';
import styles from './GameInterface.module.css';
import InputField from '../SharedComponents/InputField/InputField';
import type { GameState } from '../GameState/GameState';

interface GameInterfaceProps {
    onAskQuestion: (question: string) => void;
    gameState: GameState;
    onStartNewGame: () => void;
}

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
            <h1 className={styles.title}>Twenty Questions</h1>
            <p className={styles.subtitle}>See if you can guess what I am thinking of.</p>
            
            <div className={styles.gameInfo}>
                <p>Questions remaining: {gameState.questionsRemaining}</p>
                {gameState.gameStatus === 'complete' && (
                    <div className={styles.gameComplete}>
                        <p>Game Over!</p>
                        <button onClick={onStartNewGame} className={styles.newGameButton}>
                            Start New Game
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.questionsList}>
                {gameState.questions.map((q, index) => (
                    <div key={index} className={styles.questionItem}>
                        <p className={styles.questionText}>{q.text}</p>
                        <p className={styles.answerText}>{q.answer}</p>
                    </div>
                ))}
            </div>

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
