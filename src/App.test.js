import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';


global.Math.random = () => 0.5;

describe('Guessing Game Tests', () => {
  test('renders difficulty selection', () => {
    render(<App />);
    expect(screen.getByText('Choose Difficulty')).toBeInTheDocument();
  });

  test('starts game on difficulty click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Medium'));
    expect(screen.getByText('Guess the Number')).toBeInTheDocument();
  });

  test('shows error for invalid input', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Medium'));
    const input = screen.getByPlaceholderText('Enter your guess');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
  });

  test('shows "too low" for low guess', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Medium'));
    const input = screen.getByPlaceholderText('Enter your guess');
    fireEvent.change(input, { target: { value: '25' } });
    fireEvent.click(screen.getByText('Submit Guess'));
    expect(screen.getByText('📈 Too low! Try a higher number.')).toBeInTheDocument();
  });

  test('shows "too high" for high guess', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Medium'));
    const input = screen.getByPlaceholderText('Enter your guess');
    fireEvent.change(input, { target: { value: '75' } });
    fireEvent.click(screen.getByText('Submit Guess'));
    expect(screen.getByText('📉 Too high! Try a lower number.')).toBeInTheDocument();
  });

  test('shows win message for correct guess', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Medium'));
    const input = screen.getByPlaceholderText('Enter your guess');
    fireEvent.change(input, { target: { value: '51' } });
    fireEvent.click(screen.getByText('Submit Guess'));
    expect(screen.getByText('🎉 Correct! You won!')).toBeInTheDocument();
  });

  test('decrements attempts after guess', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Medium'));
    const input = screen.getByPlaceholderText('Enter your guess');
    fireEvent.change(input, { target: { value: '25' } });
    fireEvent.click(screen.getByText('Submit Guess'));
    expect(screen.getByText(/9/)).toBeInTheDocument();
  });

  test('resets game with New Game button', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Medium'));
    const input = screen.getByPlaceholderText('Enter your guess');
    fireEvent.change(input, { target: { value: '25' } });
    fireEvent.click(screen.getByText('Submit Guess'));
    fireEvent.click(screen.getByText('New Game'));
    expect(screen.getByText('/ 10 attempts left')).toBeInTheDocument();
  });
});