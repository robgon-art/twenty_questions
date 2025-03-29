import React from 'react';
import { render, screen, fireEvent, act, RenderResult } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {
    const renderInputField = (props: Partial<React.ComponentProps<typeof InputField>> = {}) => {
        let lastSubmittedMessage: string | null = null;
        const handleSubmit = (message: string) => {
            lastSubmittedMessage = message;
        };

        let result: RenderResult = render(<div />); // Initialize with a default value
        act(() => {
            result = render(
                <InputField
                    onSubmit={handleSubmit}
                    {...props}
                />
            );
        });

        const placeholder = props.placeholder || 'Type your message...';

        return {
            ...result,
            getLastSubmittedMessage: () => lastSubmittedMessage,
            input: screen.getByPlaceholderText(placeholder),
            submitButton: screen.getByRole('button', { name: /send/i })
        };
    };

    it('renders with default props', () => {
        const { input, submitButton } = renderInputField();

        expect(input).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(input).toBeEnabled();
        expect(submitButton).toBeDisabled(); // Button should be disabled when there's no input
    });

    it('submits valid messages and clears input', () => {
        const { input, submitButton, getLastSubmittedMessage } = renderInputField();

        fireEvent.change(input, { target: { value: 'Hello, World!' } });
        expect(submitButton).toBeEnabled(); // Button should be enabled when there's input
        fireEvent.click(submitButton);

        expect(getLastSubmittedMessage()).toBe('Hello, World!');
        expect(input).toHaveValue('');
        expect(submitButton).toBeDisabled(); // Button should be disabled after clearing input
    });

    it('prevents submission of empty messages', () => {
        const { submitButton, getLastSubmittedMessage } = renderInputField();

        fireEvent.click(submitButton);

        expect(getLastSubmittedMessage()).toBeNull();
    });

    it('handles disabled state correctly', () => {
        const { input, submitButton } = renderInputField({ disabled: true });

        expect(input).toBeDisabled();
        expect(submitButton).toBeDisabled();
    });

    it('accepts custom placeholder text', () => {
        const customPlaceholder = 'Enter your question...';
        const { input } = renderInputField({ placeholder: customPlaceholder });

        expect(input).toHaveAttribute('placeholder', customPlaceholder);
    });
});
