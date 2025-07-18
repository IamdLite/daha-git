// utils/api.ts

/**
 * Standard fetch wrapper that:
 * - Adds Authorization Bearer token from localStorage if available
 * - Handles various forms of headers: Headers instance, array, or plain object
 * - On HTTP 401, removes tokens, sets a session expired flag, and redirects
 */

export async function fetchWithAuth(
  input: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  // Get access token from localStorage (adjust if you store it elsewhere)
  const token = localStorage.getItem("access_token");

  // Always create plain object to build headers
  let headers: Record<string, string> = {};

  // If options.headers exists, copy all keys (array/Headers/object supported)
  if (options.headers) {
    if (options.headers instanceof Headers) {
      // Convert Headers instance to plain object
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      // Convert array of entries to object
      for (const [key, value] of options.headers) {
        headers[key] = value;
      }
    } else {
      // Assume standard object { [key: string]: string }
      headers = { ...options.headers } as Record<string, string>;
    }
  }

  // Inject access token if present
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Build fetch request
  const response = await fetch(input, {
    ...options,
    headers,
  });

  // Handle unauthorized: remove token, set reason, redirect to login
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isAuthenticated");
    localStorage.setItem("logout_reason", "expired");
    // Redirect to login with a flag for a friendly message
    window.location.href = "/login?expired=true";
    // Optionally, throw to stop further handling in client code
    throw new Error("Session expired (401 Unauthorized)");
  }

  // Return original response for further chaining (e.g. .json())
  return response;
}
