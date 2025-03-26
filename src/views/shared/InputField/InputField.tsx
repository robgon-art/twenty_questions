import React, { useState, useRef, useEffect } from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
    onSubmit: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
    buttonText?: string;
    initialValue?: string;
}

const isMessageValid = (message: string, disabled: boolean, buttonText: string): boolean => 
    (buttonText === 'Play Again' || Boolean(message.trim())) && !disabled;

const handleInputChange = (setMessage: (value: string) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>): void => 
        setMessage(e.target.value);

const InputField: React.FC<InputFieldProps> = ({
    onSubmit,
    placeholder = 'Type your message...',
    disabled = false,
    buttonText = 'Send',
    initialValue = ''
}) => {
    const [message, setMessage] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleFormSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (isMessageValid(message, disabled, buttonText)) {
            onSubmit(message.trim());
            setMessage('');
            // Focus the input after submission
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    };

    return (
        <form 
            onSubmit={handleFormSubmit}
            className={styles.inputForm}
        >
            <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={handleInputChange(setMessage)}
                placeholder={placeholder}
                disabled={disabled}
                className={styles.input}
            />
            <button
                type="submit"
                disabled={disabled || (buttonText !== 'Play Again' && !message.trim())}
                className={styles.submitButton}
            >
                {buttonText}
            </button>
        </form>
    );
};

export default InputField;
