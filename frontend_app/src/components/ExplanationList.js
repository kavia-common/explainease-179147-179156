import React, { useMemo } from 'react';
import ExplanationCard from './ExplanationCard';

/**
 * ExplanationList renders a stack of explanation cards.
 */

// PUBLIC_INTERFACE
export default function ExplanationList({ explanations = [], isLoading = false }) {
  /**
   * Renders loading state and a list of ExplanationCard.
   * The explanations prop is an array of { level, content } in desired order.
   * We enforce a consistent display order and gracefully handle partial progressive results.
   */
  const ORDER = ['ELI5', 'ELI15', 'Intermediate', 'Expert'];

  const normalized = useMemo(() => {
    const byLevel = new Map(explanations.map((e) => [e.level, e]));
    return ORDER
      .map((lvl) => byLevel.get(lvl))
      .filter(Boolean);
  }, [explanations]);

  return (
    <div className="list" aria-busy={isLoading ? 'true' : 'false'}>
      {isLoading && (
        <div className="loading" role="status" aria-live="polite">
          Preparing clear explanations at different levels…
        </div>
      )}

      {!isLoading && normalized.length === 0 && (
        <div className="muted-text" style={{ padding: '8px 2px' }}>
          Your explanations will appear here.
        </div>
      )}

      {normalized.map((item, idx) => (
        <ExplanationCard
          key={`${item.level}-${idx}`}
          level={item.level}
          content={item.content}
        />
      ))}
    </div>
  );
}
