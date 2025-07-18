
// Use Vite environment variables (or static fallback)
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const BASE_URL_PROD = import.meta.env.VITE_BACKEND_URL_PROD || 'https://daha.linkpc.net';
const API_URL = import.meta.env.MODE === 'production' ? BASE_URL_PROD : BASE_URL;

export const requestTelegramCode = async (data: { username: string }): Promise<{ message?: string }> => {
  try {
    const username = data.username.replace(/^@/, '');
    console.log('Requesting code for username:', username, 'Endpoint:', `${API_URL}/auth/login/request`);
    const response = await fetch(`${API_URL}/auth/login/request`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    console.log('Code request response status:', response.status, 'Status Text:', response.statusText);
    if (!response.ok) {
      let errorMessage = 'Failed to request code';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || (await response.text());
      } catch {
        errorMessage = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
      }
      console.error('Code request error:', errorMessage);
      throw new Error(errorMessage);
    }

    const dataResponse = await response.json();
    console.log('Code request response data:', dataResponse);
    return dataResponse; // Expect { message: string }
  } catch (error) {
    console.error('requestTelegramCode error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to request verification code');
  }
};

export const verifyTelegramCode = async (data: { username: string; verification_code: string }): Promise<{ access_token: string }> => {
  try {
    const username = data.username.replace(/^@/, '');
    console.log('Verifying code for username:', username, 'Code:', data.verification_code, 'Endpoint:', `${API_URL}/auth/login/verify`);
    const response = await fetch(`${API_URL}/auth/login/verify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, verification_code: data.verification_code }),
    });

    console.log('Code verification response status:', response.status, 'Status Text:', response.statusText);
    if (!response.ok) {
      let errorMessage = 'Failed to verify code';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || (await response.text());
      } catch {
        errorMessage = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
      }
      console.error('Code verification error:', errorMessage);
      throw new Error(errorMessage);
    }

    const dataResponse = await response.json();
    console.log('Code verification response data:', dataResponse);
    return dataResponse; // Expect { access_token: string }
  } catch (error) {
    console.error('verifyTelegramCode error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to verify code');
  }
};

// src/api/auth.ts

/**
 * Fetch wrapper that:
 * - Adds Authorization Bearer token from localStorage if available
 * - Handles headers that are object, Headers, or array of tuples
 * - On 401, removes token & redirects to login with session-expired message
 */
export async function authenticatedFetch(
  input: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("access_token");

  // Always create a plain object to build headers
  let headers: Record<string, string> = {};

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
    } else if (typeof options.headers === "object") {
      headers = { ...options.headers } as Record<string, string>;
    }
  }

  // Add Authorization token if it exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(input, {
    ...options,
    headers,
  });

  // On 401, clean up token and redirect to login
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isAuthenticated");
    localStorage.setItem("logout_reason", "expired");
    // Redirect
    window.location.href = "/login?expired=true";
    throw new Error("Session expired (401 Unauthorized)");
  }

  return response;
}
