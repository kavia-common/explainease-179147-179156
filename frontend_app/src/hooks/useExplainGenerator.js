import { useCallback, useEffect, useRef, useState } from 'react';
import { LEVELS, buildContentForLevel, BuildError } from '../utils/sampleData';

/**
 * Hook providing mocked progressive explanation generation.
 * Exposes a generate(prompt) function that yields staged results at deterministic delays
 * across levels [ELI5, ELI15, Intermediate, Expert]. Supports cancellation/reset and basic errors.
 */

// PUBLIC_INTERFACE
export default function useExplainGenerator() {
  /**
   * PUBLIC_INTERFACE
   * Returns:
   *  - generate(prompt: string): Promise<void>  -> starts staged generation
   *  - loading: boolean                         -> true while generating
   *  - error: string | null                     -> error message if any
   *  - results: Array<{ level: string, content: string }>
   *  - reset(): void                            -> cancel and clear all state
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  // Track the latest "run" so we can cancel prior timers
  const timersRef = useRef([]);
  const runIdRef = useRef(0);
  const cancelledRef = useRef(false);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const reset = useCallback(() => {
    // Cancel ongoing work and clear state
    cancelledRef.current = true;
    clearTimers();
    runIdRef.current += 1;
    setLoading(false);
    setError(null);
    setResults([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const schedule = (fn, delay) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
  };

  const generate = useCallback(async (prompt) => {
    // Reset previous state and begin a new run
    reset();
    setLoading(true);
    cancelledRef.current = false;
    const thisRun = runIdRef.current;

    // Basic input validation + deterministic error for testing
    if (!prompt || !prompt.trim()) {
      setError('Please enter a topic or text to explain.');
      setLoading(false);
      return;
    }
    if (/error/i.test(prompt)) {
      // Deterministic mocked error when prompt contains "error"
      setError('Mocked generation error: failed to process the input.');
      setLoading(false);
      return;
    }

    // Simulated staged delays (ms) per level for progressive feel
    const delays = [350, 700, 1050, 1400];

    try {
      LEVELS.forEach((level, idx) => {
        schedule(() => {
          // Guard against cancellation or overlap between runs
          if (cancelledRef.current || runIdRef.current !== thisRun) return;

          try {
            const content = buildContentForLevel(prompt, level);
            setResults((prev) => {
              // replace existing level or append in order
              const existingIdx = prev.findIndex((x) => x.level === level);
              if (existingIdx >= 0) {
                const clone = prev.slice();
                clone[existingIdx] = { level, content };
                return clone;
              }
              return [...prev, { level, content }];
            });

            // When last update fires, end loading (if still same run)
            if (idx === LEVELS.length - 1) {
              setLoading(false);
            }
          } catch (e) {
            const message =
              e instanceof BuildError
                ? e.message
                : 'An unexpected error occurred while generating.';
            setError(message);
            setLoading(false);
          }
        }, delays[idx]);
      });
    } catch (e) {
      setError('Unexpected error scheduling generation.');
      setLoading(false);
    }
  }, [reset]);

  return { generate, loading, error, results, reset };
}
