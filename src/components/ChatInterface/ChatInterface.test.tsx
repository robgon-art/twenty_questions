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

    it('renders with the initial question', () => {
        render(<ChatInterface onAskQuestion={mockOnAskQuestion} />);
        
        const input = screen.getByDisplayValue('Is it an animal, mineral, or vegetable?');
        expect(input).toBeInTheDocument();
    });

    it('calls onAskQuestion when a question is submitted', () => {
        render(<ChatInterface onAskQuestion={mockOnAskQuestion} />);
        
        const input = screen.getByDisplayValue('Is it an animal, mineral, or vegetable?');
        const submitButton = screen.getByText('Ask Question');
        
        fireEvent.change(input, { target: { value: 'Is it bigger than a breadbox?' } });
        fireEvent.click(submitButton);
        
        expect(mockOnAskQuestion).toHaveBeenCalledWith('Is it bigger than a breadbox?');
    });
});
