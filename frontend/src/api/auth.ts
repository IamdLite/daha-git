import { jwtDecode } from "jwt-decode";

// Use CRA environment variables (or static fallback)
const BASE_URL = process.env.REACT_APP_BACKEND_URL || "https://daha.linkpc.net";
const BASE_URL_PROD = process.env.REACT_APP_BACKEND_URL_PROD || "https://daha.linkpc.net";
const API_URL = process.env.NODE_ENV === "production" ? BASE_URL_PROD : BASE_URL;

export const requestTelegramCode = async (data: { username: string }): Promise<{ message?: string }> => {
  try {
    const username = data.username.replace(/^@/, "");
    console.log("Requesting code for username:", username, "Endpoint:", `${API_URL}/auth/login/request`);
    const response = await fetch(`${API_URL}/auth/login/request`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    console.log("Code request response status:", response.status, "Status Text:", response.statusText);
    if (!response.ok) {
      let errorMessage = "Failed to request code";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || (await response.text());
      } catch {
        errorMessage = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
      }
      console.error("Code request error:", errorMessage);
      throw new Error(errorMessage);
    }

    const dataResponse = await response.json();
    console.log("Code request response data:", dataResponse);
    return dataResponse; // Expect { message: string }
  } catch (error) {
    console.error("requestTelegramCode error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to request verification code");
  }
};

export const verifyTelegramCode = async (data: { username: string; verification_code: string }): Promise<{ access_token: string }> => {
  try {
    const username = data.username.replace(/^@/, "");
    console.log("Verifying code for username:", username, "Code:", data.verification_code, "Endpoint:", `${API_URL}/auth/login/verify`);
    const response = await fetch(`${API_URL}/auth/login/verify`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, verification_code: data.verification_code }),
    });

    console.log("Code verification response status:", response.status, "Status Text:", response.statusText);
    if (!response.ok) {
      let errorMessage = "Failed to verify code";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || (await response.text());
      } catch {
        errorMessage = await response.text() || `HTTP ${response.status}: ${response.statusText}`;
      }
      console.error("Code verification error:", errorMessage);
      throw new Error(errorMessage);
    }

    const dataResponse = await response.json();
    console.log("Code verification response data:", dataResponse);
    return dataResponse; // Expect { access_token: string }
  } catch (error) {
    console.error("verifyTelegramCode error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to verify code");
  }
};

export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No access token available");
  }

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("access_token");
      localStorage.removeItem("username");
      throw new Error("Token expired");
    }

    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    console.log("Authenticated fetch to:", url, "Headers:", headers);
    return fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error("Token validation error:", err);
    throw err;
  }
};