import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const title = screen.getByText(/ExplainLike5/i);
  expect(title).toBeInTheDocument();
});
