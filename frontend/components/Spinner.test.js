import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // ✅ Updated import for `jest-dom`
import Spinner from './Spinner';

test('sanity', () => {
  expect(true).toBe(true);
});

test('Spinner does not render when on is false', () => {
  render(<Spinner on={false} />);
  const spinner = screen.queryByText(/please wait/i);
  expect(spinner).not.toBeInTheDocument(); // ✅ This should work now
});

test('Spinner renders when on is true', () => {
  render(<Spinner on={true} />);
  const spinner = screen.getByText(/please wait/i);
  expect(spinner).toBeInTheDocument(); // ✅ This should work now
});