import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders search interface', () => {
  render(<App />);
  const searchElement = screen.getByPlaceholderText(/ask anything/i);
  expect(searchElement).toBeInTheDocument();
});
