import React, { useState } from 'react';
import styles from './GameState.module.css';

interface GameStateProps {
    onGameComplete: (success: boolean) => void;
}

interface Question {
    text: string;
    answer: string;
    timestamp: Date;
}

const GameState: React.FC<GameStateProps> = ({ onGameComplete }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState<string>('');
    const [gameStatus, setGameStatus] = useState<'active' | 'complete'>('active');

    const handleQuestion = (questionText: string) => {
        if (gameStatus !== 'active') return;

        const newQuestion: Question = {
            text: questionText,
            answer: currentAnswer,
            timestamp: new Date()
        };

        setQuestions(prev => [...prev, newQuestion]);

        // Check if we've reached 20 questions
        if (questions.length + 1 >= 20) {
            setGameStatus('complete');
            onGameComplete(false); // Player didn't guess correctly
        }
    };

    const handleAnswer = (answer: string) => {
        setCurrentAnswer(answer);
    };

    return (
        <div className={styles.container}>
            <div className={styles.gameInfo}>
                <p>Questions asked: {questions.length}/20</p>
                {gameStatus === 'complete' && (
                    <p className={styles.gameComplete}>Game Over!</p>
                )}
            </div>
            <div className={styles.questionsList}>
                {questions.map((q, index) => (
                    <div key={index} className={styles.questionItem}>
                        <p className={styles.questionText}>{q.text}</p>
                        <p className={styles.answerText}>{q.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameState; 