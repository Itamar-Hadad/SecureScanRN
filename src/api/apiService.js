/**
 * apiService.js
 *
 * Handles all HTTP communication with the backend.
 * The baseUrl is dynamic — it comes from the QR code, so we can't hardcode it.
 */

/**
 * Resolves a QR token to user information.
 * Calls: POST {baseUrl}/qr/resolve
 *
 * @param {string} baseUrl  - The backend URL from the QR code
 * @param {string} qrToken  - The token from the QR code
 * @returns {Object}        - { success: bool, data?, error? }
 */
export async function resolveQrToken(baseUrl, qrToken) {
  try {
    const url = normalizeUrl(baseUrl) + 'qr/resolve';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_token: qrToken }),
    });

    const json = await response.json();

    if (response.ok) {
      return { success: true, data: json };
    } else {
      const errorMsg = json?.detail || json?.message || `Server error: ${response.status}`;
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}

/**
 * Validates the user's password.
 * Calls: POST {baseUrl}/auth/validate
 *
 * @param {string} baseUrl  - The backend URL from the QR code
 * @param {string} userId   - The user ID from the resolved QR token
 * @param {string} password - The password entered by the user
 * @returns {Object}        - { success: bool, data?, error? }
 */
export async function validatePassword(baseUrl, userId, password) {
  try {
    const url = normalizeUrl(baseUrl) + 'auth/validate';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password }),
    });

    const json = await response.json();

    if (json?.authenticated === true) {
      return { success: true, data: json };
    } else {
      const errorMsg = extractErrorString(json, 'Authentication failed.');
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}

/**
 * Extracts a plain error string from a JSON response object.
 * Handles any nesting or unexpected structure from the server.
 */
function extractErrorString(json, fallback) {
  if (!json) return fallback;
  // Try common error field names
  const candidates = [json.error, json.detail, json.message];
  for (const val of candidates) {
    if (typeof val === 'string' && val.length > 0) return val;
  }
  return fallback;
}

/**
 * Ensures the base URL always ends with a slash.
 * e.g. "https://api.example.com" → "https://api.example.com/"
 */
function normalizeUrl(url) {
  return url.endsWith('/') ? url : url + '/';
}
