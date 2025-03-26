import React from 'react';
import styles from './ChatInterface.module.css';
import InputField from '../SharedComponents/InputField/InputField';

interface ChatInterfaceProps {
    onAskQuestion: (question: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onAskQuestion }) => {
    const handleSubmit = (message: string) => {
        onAskQuestion(message);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Twenty Questions</h1>
            <p className={styles.subtitle}>See if you can guess what I am thinking of.</p>
            <InputField
                onSubmit={handleSubmit}
                placeholder="Type your question..."
                disabled={false}
                buttonText="Ask Question"
                initialValue="Is it an animal, mineral, or vegetable?"
            />
        </div>
    );
};

export default ChatInterface;
