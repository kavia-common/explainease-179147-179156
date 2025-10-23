import React from 'react';

/**
 * Header renders the application title, tagline, and theme toggle control.
 */

// PUBLIC_INTERFACE
export default function Header({ theme = 'light', onToggleTheme = () => {} }) {
  /** Accessible header with brand and theme toggle button. */
  return (
    <header className="header" role="banner">
      <div className="container inner">
        <div className="brand" aria-label="Brand">
          <div className="brand-badge" aria-hidden="true">E5</div>
          <div className="title-wrap">
            <h1 className="title">ExplainLike5</h1>
            <p className="tagline">Simplify any topic—ELI5 to Expert.</p>
          </div>
        </div>
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}
