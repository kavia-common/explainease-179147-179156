import React, { useState } from 'react';

/**
 * ExplanationCard shows an individual explanation with expand/collapse and copy.
 */

// PUBLIC_INTERFACE
export default function ExplanationCard({ level, content }) {
  /** A11y-friendly card with toggleable body and placeholder copy action. */
  const [expanded, setExpanded] = useState(true);

  const toggle = () => setExpanded((v) => !v);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      // Placeholder feedback; in future, use toast/snackbar
      alert('Copied explanation to clipboard.');
    } catch {
      alert('Copy not supported in this environment.');
    }
  };

  return (
    <article className="card" aria-label={`${level} explanation`}>
      <div className="card-header">
        <span className="level-pill" aria-label="Explanation level">{level}</span>
        <div className="card-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={handleCopy}
            aria-label={`Copy ${level} explanation`}
            title="Copy"
          >
            📋 Copy
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-expanded={expanded ? 'true' : 'false'}
            aria-controls={`content-${level}`}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▾ Collapse' : '▸ Expand'}
          </button>
        </div>
      </div>
      {expanded && (
        <div id={`content-${level}`} className="card-content">
          <p>{content}</p>
        </div>
      )}
    </article>
  );
}
