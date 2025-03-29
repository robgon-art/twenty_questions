import React, { useState, useEffect } from 'react';
import styles from './GameInterface.module.css';
import InputField from '../shared/InputField/InputField';
import { GameState } from '../../models/game/types';
import { getQuestionsRemaining } from '../../models/game/rules';
import { MAX_QUESTIONS } from '../../constants';
import { toWords } from 'number-to-words';
import ConfettiEffect from '../../effects/ConfettiEffect';
import RainEffect from '../../effects/RainEffect';

interface GameInterfaceProps {
    onAskQuestion: (question: string) => Promise<void>;
    gameState: GameState;
    onStartNewGame: () => void;
}

// Capitalize first letter
const capitalize = (str: string): string => 
    str.charAt(0).toUpperCase() + str.slice(1);

const GameHeader: React.FC<{ 
    remaining: number, 
    gameState: GameState 
}> = ({ remaining, gameState }) => {
    // Determine which message to show based on game state
    let subtitle;
    if (gameState.gameStatus === 'active') {
        subtitle = `See if you can guess what I am thinking of. Remaining questions: ${remaining}`;
    } else if (gameState.gameStatus === 'success') {
        subtitle = `You win! 🎉 You got it correct in ${MAX_QUESTIONS - gameState.questionsRemaining} questions.`;
    } else {
        subtitle = `You lose. 😢 The answer was `;
    }

    return (
        <>
            <h1 className={styles.title}>{capitalize(toWords(MAX_QUESTIONS))} Questions</h1>
            <p className={styles.subtitle}>
                {subtitle}
                {gameState.gameStatus === 'failed' && (
                    <span style={{ fontWeight: 'bold', color: '#007bff' }}>{gameState.currentObject}</span>
                )}
            </p>
        </>
    );
};

const QuestionItem: React.FC<{ question: GameState['questions'][0], index: number }> = ({ question, index }) => (
    <div className={styles.questionItem}>
        <p className={styles.questionText}>
            {index + 1}. {question.text}
            {index > 0 && <span className={styles.answerText}>{question.answer}</span>}
        </p>
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
    const [shouldFocus, setShouldFocus] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<string | undefined>();
    const [showRain, setShowRain] = useState(false);

    // Handle rain effect timing
    useEffect(() => {
        if (gameState.gameStatus === 'failed') {
            setShowRain(true);
            const timer = setTimeout(() => {
                setShowRain(false);
            }, 10000); // 10 seconds

            return () => clearTimeout(timer);
        }
    }, [gameState.gameStatus]);

    const handleSubmit = async (message: string) => {
        // If game is not active, start a new game instead of asking a question
        if (gameState.gameStatus !== 'active') {
            onStartNewGame();
            return;
        }

        setIsLoading(true);
        setCurrentQuestion(message);
        try {
            await onAskQuestion(message);
            // Set focus after the question is answered
            setShouldFocus(true);
        } finally {
            setIsLoading(false);
            setCurrentQuestion(undefined);
        }
    };

    // Reset focus state after it's been applied
    useEffect(() => {
        if (shouldFocus) {
            setShouldFocus(false);
        }
    }, [shouldFocus]);

    // Determine button text based on game state
    const buttonText = isLoading 
        ? "Thinking..." 
        : gameState.gameStatus === 'active' 
            ? "Ask Question" 
            : "Play Again";

    // Determine placeholder text based on game state
    const placeholder = gameState.gameStatus === 'active'
        ? "Type your question..."
        : "Click Play Again to start over";

    return (
        <div className={styles.container} style={{ position: 'relative' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                {gameState.gameStatus === 'success' && <ConfettiEffect />}
                {showRain && <RainEffect />}
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
                <GameHeader remaining={getQuestionsRemaining(gameState)} gameState={gameState} />
                <InputField
                    onSubmit={handleSubmit}
                    placeholder={placeholder}
                    disabled={isLoading}
                    buttonText={buttonText}
                    initialValue="Is it an animal, mineral, or vegetable?"
                    focus={shouldFocus}
                    disabledQuestion={currentQuestion}
                />
                <QuestionList questions={gameState.questions} />
            </div>
        </div>
    );
};

export default GameInterface; 