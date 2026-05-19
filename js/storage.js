/**
 * storage.js
 *
 * Thin wrapper around localStorage for submission data.
 * Keeps all storage access in one place so we can mock it in tests
 * and swap the backend later if needed.
 */

const STORAGE_KEY = 'submissions';

/**
 * Returns all stored submissions, newest first.
 * Handles missing or corrupt data gracefully.
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt data — start fresh rather than crashing
    return [];
  }
}

/**
 * Adds a new submission to storage.
 * Generates a unique ID and timestamp, prepends to the list (newest first).
 */
export function addSubmission(data) {
  const submission = {
    id: generateId(),
    ...data,
    submittedAt: new Date().toISOString(),
  };

  const existing = getSubmissions();
  existing.unshift(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  return submission;
}

/**
 * Removes a submission by ID.
 * Returns true if the item was found and removed, false otherwise.
 */
export function removeSubmission(id) {
  const existing = getSubmissions();
  const filtered = existing.filter((item) => item.id !== id);

  if (filtered.length === existing.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Generates a short unique ID.
 * Uses crypto.randomUUID where available, falls back to a timestamp-based ID.
 */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
