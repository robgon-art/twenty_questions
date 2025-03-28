import React, { useState, useRef, useEffect } from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
    onSubmit: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
    buttonText?: string;
    initialValue?: string;
    focus?: boolean;
    disabledQuestion?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    onSubmit,
    placeholder = 'Type your message...',
    disabled = false,
    buttonText = 'Send',
    initialValue = '',
    focus = false,
    disabledQuestion
}) => {
    const [message, setMessage] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update message when initialValue changes
    useEffect(() => {
        if (initialValue !== undefined) {
            setMessage(initialValue);
        }
    }, [initialValue]);

    // Focus on mount and when focus prop changes
    useEffect(() => {
        if (focus && !disabled) {
            inputRef.current?.focus();
        }
    }, [focus, disabled]);

    const handleFormSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        // If it's Play Again button, or if there's a valid message
        if (buttonText === 'Play Again' || message.trim()) {
            onSubmit(message.trim());
            if (buttonText === 'Play Again') {
                // Set the initial question when restarting
                setMessage("Is it an animal, mineral, or vegetable?");
            } else {
                setMessage('');
            }
        }
    };

    // Check if the button should be enabled
    const isButtonEnabled = !disabled && (
        buttonText === 'Play Again' || 
        message.trim() !== '' || 
        (initialValue && message === initialValue)
    );

    return (
        <form 
            onSubmit={handleFormSubmit}
            className={styles.inputForm}
        >
            <input
                ref={inputRef}
                type="text"
                value={disabled ? disabledQuestion || message : message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={`${styles.input} ${disabled ? styles.disabled : ''}`}
            />
            <button
                type="submit"
                disabled={!isButtonEnabled}
                className={styles.submitButton}
            >
                {buttonText}
            </button>
        </form>
    );
};

export default InputField;
