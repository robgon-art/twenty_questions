import React, { useState } from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
    onSubmit: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const isMessageValid = (message: string, disabled: boolean): boolean => 
    Boolean(message.trim()) && !disabled;

const handleInputChange = (setMessage: (value: string) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>): void => 
        setMessage(e.target.value);

const handleFormSubmit = (
    message: string,
    disabled: boolean,
    onSubmit: (message: string) => void,
    setMessage: (value: string) => void
) => (e: React.FormEvent): void => {
    e.preventDefault();
    if (isMessageValid(message, disabled)) {
        onSubmit(message.trim());
        setMessage('');
    }
};

const InputField: React.FC<InputFieldProps> = ({
    onSubmit,
    placeholder = 'Type your message...',
    disabled = false,
}) => {
    const [message, setMessage] = useState('');

    return (
        <form 
            onSubmit={handleFormSubmit(message, disabled, onSubmit, setMessage)} 
            className={styles.inputForm}
        >
            <input
                type="text"
                value={message}
                onChange={handleInputChange(setMessage)}
                placeholder={placeholder}
                disabled={disabled}
                className={styles.input}
            />
            <button
                type="submit"
                disabled={disabled || !message.trim()}
                className={styles.submitButton}
            >
                Send
            </button>
        </form>
    );
};

export default InputField;
