import React, { useState } from 'react';

/**
 * ExplanationCard shows an individual explanation with expand/collapse and copy.
 */

// PUBLIC_INTERFACE
export default function ExplanationCard({ level, content }) {
  /** A11y-friendly card with toggleable body and copy action with visual feedback. */
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggle = () => setExpanded((v) => !v);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        // Fallback: create a temp textarea if Clipboard API not available
        const el = document.createElement('textarea');
        el.value = content;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      // Auto-hide the toast after a short delay
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // If copy fails, show a temporary failure state
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
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
            aria-live="polite"
            title="Copy"
          >
            {copied ? '✅ Copied' : '📋 Copy'}
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
          {/* Inline toast region for screen readers and visual cue */}
          <div role="status" aria-live="polite" className="sr-only">
            {copied ? 'Copied to clipboard' : ''}
          </div>
        </div>
      )}
    </article>
  );
}
