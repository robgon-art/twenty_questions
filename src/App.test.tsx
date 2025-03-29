import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    act(() => {
      render(<App />);
    });
    expect(document.querySelector('.App')).toBeInTheDocument();
  });
});
