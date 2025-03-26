import React, { useState } from 'react';
import styles from './ChatInterface.module.css';

interface ChatInterfaceProps {
    onAskQuestion: (question: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAskQuestion }) => {
    const [question, setQuestion] = useState("Is it an animal, vegetable, or mineral?");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAskQuestion(question);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Twenty Questions</h1>
            <p className={styles.subtitle}>See if you can guess what I am thinking of.</p>
            <form onSubmit={handleSubmit} className={styles.questionForm} role="form">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className={styles.questionInput}
                    placeholder="Enter your question..."
                />
                <button type="submit" className={styles.askButton}>
                    Ask Question
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
