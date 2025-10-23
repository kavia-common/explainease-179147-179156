import React from 'react';
import ExplanationCard from './ExplanationCard';

/**
 * ExplanationList renders a stack of explanation cards.
 */

// PUBLIC_INTERFACE
export default function ExplanationList({ explanations = [], isLoading = false }) {
  /**
   * Renders loading state and a list of ExplanationCard.
   * The explanations prop is an array of { level, content } in desired order.
   */
  return (
    <div className="list" aria-busy={isLoading ? 'true' : 'false'}>
      {isLoading && (
        <div className="loading" role="status" aria-live="polite">
          Preparing clear explanations at different levels…
        </div>
      )}

      {!isLoading && explanations.length === 0 && (
        <div className="muted-text" style={{ padding: '8px 2px' }}>
          Your explanations will appear here.
        </div>
      )}

      {!isLoading &&
        explanations.map((item, idx) => (
          <ExplanationCard
            key={`${item.level}-${idx}`}
            level={item.level}
            content={item.content}
          />
        ))}
    </div>
  );
}
