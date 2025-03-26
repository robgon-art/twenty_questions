import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInterface from './ChatInterface';

describe('ChatInterface', () => {
    const mockOnAskQuestion = jest.fn();

    beforeEach(() => {
        mockOnAskQuestion.mockClear();
    });

    it('renders with the correct title and subtitle', () => {
        render(<ChatInterface onAskQuestion={mockOnAskQuestion} />);
        
        expect(screen.getByText('Twenty Questions')).toBeInTheDocument();
        expect(screen.getByText('See if you can guess what I am thinking of.')).toBeInTheDocument();
    });

    it('renders with the default question', () => {
        render(<ChatInterface onAskQuestion={mockOnAskQuestion} />);
        
        const input = screen.getByPlaceholderText('Enter your question...');
        expect(input).toHaveValue('Is it an animal, vegetable, or mineral?');
    });

    it('allows question text to be changed', () => {
        render(<ChatInterface onAskQuestion={mockOnAskQuestion} />);
        
        const input = screen.getByPlaceholderText('Enter your question...');
        fireEvent.change(input, { target: { value: 'Is it bigger than a breadbox?' } });
        
        expect(input).toHaveValue('Is it bigger than a breadbox?');
    });

    it('calls onAskQuestion when the form is submitted', () => {
        render(<ChatInterface onAskQuestion={mockOnAskQuestion} />);
        
        const input = screen.getByPlaceholderText('Enter your question...');
        fireEvent.change(input, { target: { value: 'Is it bigger than a breadbox?' } });
        
        const button = screen.getByText('Ask Question');
        fireEvent.click(button);
        
        expect(mockOnAskQuestion).toHaveBeenCalledWith('Is it bigger than a breadbox?');
    });

    it('prevents default form submission', () => {
        render(<ChatInterface onAskQuestion={mockOnAskQuestion} />);
        
        const form = screen.getByRole('form');
        const submitEvent = new Event('submit', {
            bubbles: true,
            cancelable: true
        });
        
        const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
        fireEvent(form, submitEvent);
        
        expect(preventDefaultSpy).toHaveBeenCalled();
    });
});
