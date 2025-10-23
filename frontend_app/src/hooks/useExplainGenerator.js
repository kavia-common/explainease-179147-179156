import { useCallback, useEffect, useRef, useState } from 'react';
import { LEVELS, buildContentForLevel, BuildError } from '../utils/sampleData';
import { explainProgressively, isApiEnabled } from '../api/client';

/**
 * Hook providing progressive explanation generation.
 * - If REACT_APP_API_BASE_URL is set, it uses the API client and returns full results at once.
 * - Otherwise, it falls back to a mocked progressive generator with staged updates.
 */

// PUBLIC_INTERFACE
export default function useExplainGenerator() {
  /**
   * PUBLIC_INTERFACE
   * Returns:
   *  - generate(prompt: string): Promise<void>  -> starts staged generation or API call
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

    // Basic input validation
    if (!prompt || !prompt.trim()) {
      setError('Please enter a topic or text to explain.');
      setLoading(false);
      return;
    }

    // If API is enabled, use it and maintain the same output shape.
    if (isApiEnabled()) {
      try {
        const data = await explainProgressively(prompt);

        // If the run was cancelled mid-flight, don't update state.
        if (cancelledRef.current || runIdRef.current !== thisRun) return;

        // Normalize ordering and ensure the same visible order as mock
        const order = new Map(LEVELS.map((lvl, i) => [lvl, i]));
        const sorted = [...data].sort((a, b) => (order.get(a.level) ?? 99) - (order.get(b.level) ?? 99));

        setResults(sorted);
        setLoading(false);
        return;
      } catch (e) {
        // On API error, present the error; do not fall back silently to mock to avoid confusion.
        const message = e?.message || 'Failed to fetch explanations from API.';
        setError(message);
        setLoading(false);
        return;
      }
    }

    // Fallback: mocked progressive generator with staged updates.
    // Deterministic mocked error when prompt contains "error"
    if (/error/i.test(prompt)) {
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
