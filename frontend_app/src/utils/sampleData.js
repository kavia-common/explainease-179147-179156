export const LEVELS = ['ELI5', 'ELI15', 'Intermediate', 'Expert'];

// Small custom error to distinguish builder-related failures
export class BuildError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BuildError';
  }
}

/**
 * Deterministic helper that returns a mocked explanation for a given level.
 * We keep the format stable so tests and UI expectations are consistent.
 */
export function buildContentForLevel(topic, level) {
  const clean = (topic || '').trim();
  if (!clean) throw new BuildError('Topic is empty.');

  switch (level) {
    case 'ELI5':
      return `Imagine ${clean} is a simple toy. We talk about it using easy words, like how it looks and what it does, without any tricky details.`;
    case 'ELI15':
      return `${clean} has a few parts that work together. You can think of it like a small system: each part has a job, and they follow basic rules to make the whole thing work.`;
    case 'Intermediate':
      return `Practically, ${clean} involves multiple components and trade-offs. We consider how data flows, where complexity lives, and how constraints shape design decisions.`;
    case 'Expert':
      return `Formally, ${clean} can be framed in terms of underlying principles and abstractions. We examine assumptions, edge cases, and performance envelopes to reason about robustness and scalability.`;
    default:
      throw new BuildError(`Unknown level: ${level}`);
  }
}
