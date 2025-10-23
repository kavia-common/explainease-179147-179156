import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import ExplainForm from './components/ExplainForm';
import ExplanationList from './components/ExplanationList';
import useExplainGenerator from './hooks/useExplainGenerator';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application component for ExplainLike5.
   * Manages theme (light/dark) and wires the progressive generation hook to the UI.
   */
  const [theme, setTheme] = useState('light');

  const { generate, loading, error, results, reset } = useExplainGenerator();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark themes, preserved on the root element via [data-theme]. */
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleGenerate = async (inputText) => {
    /**
     * Delegates to the progressive generation hook.
     * If a run is active, it will be cancelled and replaced.
     */
    await generate(inputText);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    /**
     * Clears any running generation and wipes results.
     */
    reset();
  };

  return (
    <div className="app-root">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="container" role="main" aria-live="polite">
        <section aria-label="Explain Form" className="surface section">
          <ExplainForm onGenerate={handleGenerate} onReset={handleReset} isLoading={loading} />
          {error && (
            <div className="loading" role="alert" style={{ marginTop: 12, borderStyle: 'solid', borderColor: 'var(--color-error)' }}>
              {error}
            </div>
          )}
        </section>

        <section aria-label="Explanations" className="section">
          <ExplanationList
            isLoading={loading}
            explanations={results}
          />
        </section>
      </main>
      <footer className="footer muted-text" aria-label="Footer">
        <p>ExplainLike5 — Progressive simplification from beginner to expert.</p>
      </footer>
    </div>
  );
}

export default App;
