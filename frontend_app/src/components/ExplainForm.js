import React, { useState } from 'react';

/**
 * ExplainForm provides the textarea input and trigger to generate explanations.
 */

// PUBLIC_INTERFACE
export default function ExplainForm({ onGenerate = () => {}, onReset = () => {}, isLoading = false }) {
  /** Accessible form with controlled textarea and submit button. */
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onGenerate(trimmed);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setValue('');
    onReset();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="topic-input" className="form-label">Paste your topic or text</label>
      <textarea
        id="topic-input"
        className="textarea"
        placeholder="E.g., Explain quantum entanglement, or paste part of a research paper..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby="topic-help"
        disabled={isLoading}
      />
      <div id="topic-help" className="muted-text" style={{ marginTop: 8 }}>
        We’ll generate progressive explanations: ELI5, ELI15, Intermediate, Expert.
      </div>

      <div className="form-actions" style={{ gap: 8 }}>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading || value.trim().length === 0}
          aria-busy={isLoading ? 'true' : 'false'}
        >
          {isLoading ? 'Generating…' : 'Generate Explanations'}
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={handleReset}
          disabled={isLoading === false && value.trim().length === 0}
          aria-label="Reset"
          title="Reset"
        >
          ↺ Reset
        </button>
      </div>
    </form>
  );
}
