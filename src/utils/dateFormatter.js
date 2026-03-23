/**
 * dateFormatter.js
 *
 * Converts ISO 8601 date strings from the server into a readable format.
 *
 * Example: "2024-01-15T10:30:00Z"  →  "Jan 15, 2024"
 */

/**
 * @param {string|null|undefined} dateString - ISO date string from API
 * @returns {string} Human-readable date, or the original string if parsing fails
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch (_) {
    return dateString;
  }
}
