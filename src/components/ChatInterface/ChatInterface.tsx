import React from 'react';
import styles from './ChatInterface.module.css';

interface ChatInterfaceProps {
    // We'll add props as we implement the component
}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
    return (
        <div className={styles.container}>
            {/* We'll implement the chat interface here */}
        </div>
    );
};

export default ChatInterface;
