/**
 * qrParser.js
 *
 * Parses the raw text content of a QR code into a usable config object.
 *
 * Expected QR code format (JSON string):
 * {
 *   "baseUrl": "https://api.example.com",
 *   "token": "some_unique_token"
 * }
 */

/**
 * @param {string} rawText - The raw string scanned from the QR code
 * @returns {{ baseUrl: string, token: string } | null}
 *          Returns a config object if valid, or null if the QR code is invalid.
 */
export function parseQrCode(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  const trimmed = rawText.trim();

  // QR code must contain JSON (starts with '{')
  if (!trimmed.startsWith('{')) return null;

  try {
    const parsed = JSON.parse(trimmed);
    const { baseUrl, token } = parsed;

    // Both fields must exist and be non-empty strings
    if (
      typeof baseUrl === 'string' && baseUrl.trim().length > 0 &&
      typeof token === 'string' && token.trim().length > 0
    ) {
      return { baseUrl: baseUrl.trim(), token: token.trim() };
    }

    return null;
  } catch (_) {
    // Not valid JSON
    return null;
  }
}
