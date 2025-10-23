import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

/**
 * Tests for ExplainLike5 App
 * - Verifies header title and presence of generate button
 * - Uses Jest fake timers to simulate progressive generation of explanations
 */
describe('App', () => {
  test('renders header title and generate button', () => {
    render(<App />);

    // Header title
    expect(screen.getByRole('heading', { name: /ExplainLike5/i })).toBeInTheDocument();

    // Generate button from ExplainForm
    const generateBtn = screen.getByRole('button', { name: /Generate Explanations/i });
    expect(generateBtn).toBeInTheDocument();
  });

  test('progressively generates explanations showing ELI5 first', async () => {
    jest.useFakeTimers();

    render(<App />);

    // Type a prompt and click generate
    const textarea = screen.getByLabelText(/Paste your topic or text/i);
    fireEvent.change(textarea, { target: { value: 'Quantum entanglement' } });

    const generateBtn = screen.getByRole('button', { name: /Generate Explanations/i });
    fireEvent.click(generateBtn);

    // Loading indicator appears immediately
    expect(
      screen.getByRole('status', { name: /Preparing clear explanations/i })
    ).toBeInTheDocument();

    // Advance timers to reveal ELI5 (mock hook uses 350ms for first stage)
    await act(async () => {
      jest.advanceTimersByTime(360);
      // Flush microtasks if any
      await Promise.resolve();
    });

    // ELI5 card should appear first
    expect(screen.getByLabelText(/ELI5 explanation/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/ELI15 explanation/i)).not.toBeInTheDocument();

    // Optionally ensure subsequent levels appear in order as timers advance
    await act(async () => {
      jest.advanceTimersByTime(350); // to roughly 710ms -> ELI15
      await Promise.resolve();
    });
    expect(screen.getByLabelText(/ELI15 explanation/i)).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(350); // -> Intermediate
      await Promise.resolve();
    });
    expect(screen.getByLabelText(/Intermediate explanation/i)).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(350); // -> Expert and loading ends
      await Promise.resolve();
    });
    expect(screen.getByLabelText(/Expert explanation/i)).toBeInTheDocument();

    // Loading should be gone after final stage
    expect(screen.queryByRole('status', { name: /Preparing clear explanations/i })).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
