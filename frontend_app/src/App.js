import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import ExplainForm from './components/ExplainForm';
import ExplanationList from './components/ExplanationList';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root application component for ExplainLike5.
   * Manages theme (light/dark), topic input, loading state, and placeholder explanations.
   * Renders the header, form, and list of explanation cards.
   */
  const [theme, setTheme] = useState('light');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder explanations; will be replaced by real API data later.
  const explanations = useMemo(() => {
    if (!topic) return [];
    return [
      { level: 'ELI5', content: `Imagine ${topic} is a simple thing you use every day. Here’s the easiest way to think about it...` },
      { level: 'ELI15', content: `${topic} is a bit more complex. Think of it like a system with parts that work together...` },
      { level: 'Intermediate', content: `From a practical perspective, ${topic} involves several components interacting with clear rules and trade-offs...` },
      { level: 'Expert', content: `Technically, ${topic} can be framed in terms of underlying principles, constraints, and formal abstractions...` },
    ];
  }, [topic]);

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
     * Simulates generating explanations from a backend.
     * Sets loading state and updates the topic. Replace with API call in future.
     */
    setIsLoading(true);
    setTopic(inputText.trim());
    // Simulate async latency for loading UI
    await new Promise((r) => setTimeout(r, 900));
    setIsLoading(false);
  };

  return (
    <div className="app-root">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="container" role="main" aria-live="polite">
        <section aria-label="Explain Form" className="surface section">
          <ExplainForm onGenerate={handleGenerate} isLoading={isLoading} />
        </section>

        <section aria-label="Explanations" className="section">
          <ExplanationList
            isLoading={isLoading}
            explanations={explanations}
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
