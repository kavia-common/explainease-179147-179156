 /**
  * Lightweight API client seam for ExplainLike5.
  * Uses REACT_APP_API_BASE_URL to target a backend if present; otherwise, this module
  * provides a placeholder for integration without breaking the UI.
  */

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * PUBLIC_INTERFACE
 * explainProgressively(prompt: string): Promise<Array<{ level: string, content: string }>>
 * 
 * This function posts the user prompt to the backend and expects a response shaped as:
 *   [
 *     { level: 'ELI5', content: '...' },
 *     { level: 'ELI15', content: '...' },
 *     { level: 'Intermediate', content: '...' },
 *     { level: 'Expert', content: '...' }
 *   ]
 * 
 * If REACT_APP_API_BASE_URL is not defined, this function will throw to signal that
 * the backend is not configured. The caller (hook) must handle fallback to mock.
 */
export async function explainProgressively(prompt) {
  /** Attempts to call the backend API to get progressive explanations. */
  if (!BASE_URL) {
    throw new Error('API base URL not configured');
  }

  // Compose request; path is a placeholder and can be updated when backend is available.
  const url = `${BASE_URL.replace(/\/+$/, '')}/explain`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  if (!res.ok) {
    let details = '';
    try {
      const errJson = await res.json();
      details = errJson?.message || JSON.stringify(errJson);
    } catch {
      // ignore JSON parse errors, fall back to status text
    }
    const msg = details || res.statusText || `Request failed with status ${res.status}`;
    throw new Error(`API request failed: ${msg}`);
  }

  const data = await res.json();

  // Basic shape validation to keep UI expectations consistent.
  if (!Array.isArray(data)) {
    throw new Error('Invalid API response: expected an array of { level, content }');
  }
  for (const item of data) {
    if (!item || typeof item.level !== 'string' || typeof item.content !== 'string') {
      throw new Error('Invalid API response item: expected { level: string, content: string }');
    }
  }

  return data;
}

/**
 * PUBLIC_INTERFACE
 * isApiEnabled(): boolean
 * 
 * Returns true if REACT_APP_API_BASE_URL is set, indicating that the client
 * should attempt to use the backend instead of the mock generator.
 */
export function isApiEnabled() {
  return Boolean(BASE_URL);
}
