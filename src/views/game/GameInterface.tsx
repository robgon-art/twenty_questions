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

const GameHeader: React.FC<{ 
    remaining: number, 
    gameState: GameState 
}> = ({ remaining, gameState }) => {
    // Determine which message to show based on game state
    let subtitle;
    if (gameState.gameStatus === 'active') {
        subtitle = `See if you can guess what I am thinking of. Remaining questions: ${remaining}`;
    } else if (gameState.gameStatus === 'success') {
        subtitle = `You win! You got it correct in ${20 - gameState.questionsRemaining} questions.`;
    } else {
        subtitle = `You lose. The answer was ${gameState.currentObject}.`;
    }

    return (
        <>
            <h1 className={styles.title}>Twenty Questions</h1>
            <p className={styles.subtitle}>{subtitle}</p>
        </>
    );
};

const QuestionItem: React.FC<{ question: GameState['questions'][0], index: number }> = ({ question, index }) => (
    <div className={styles.questionItem}>
        <p className={styles.questionText}>{index + 1}. {question.text} {question.answer}</p>
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
        // If game is not active, start a new game instead of asking a question
        if (gameState.gameStatus !== 'active') {
            onStartNewGame();
            return;
        }

        setIsLoading(true);
        try {
            await onAskQuestion(message);
        } finally {
            setIsLoading(false);
        }
    };

    // Determine button text based on game state
    const buttonText = isLoading 
        ? "Thinking..." 
        : gameState.gameStatus === 'active' 
            ? "Ask Question" 
            : "Play Again";

    // Determine placeholder text based on game state
    const placeholder = gameState.gameStatus === 'active'
        ? "Type your question..."
        : "Click Play Again to start a new game";

    return (
        <div className={styles.container}>
            <GameHeader remaining={getQuestionsRemaining(gameState)} gameState={gameState} />
            <InputField
                onSubmit={handleSubmit}
                placeholder={placeholder}
                disabled={isLoading}
                buttonText={buttonText}
                initialValue="Is it an animal, mineral, or vegetable?"
            />
            <QuestionList questions={gameState.questions} />
        </div>
    );
};

export default GameInterface; 