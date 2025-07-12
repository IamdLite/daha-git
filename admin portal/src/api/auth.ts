// src/api/auth.ts
import { TELEGRAM_AUTH_URL } from '../pages/Login';
import {jwtDecode} from 'jwt-decode';

export interface TelegramUser {
  id: number;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  first_name?: string;
  last_name?: string;
}

export const telegramLogin = async (telegramData: TelegramUser): Promise<{ access_token: string; token_type: string }> => {
  try {
    console.log('Sending Telegram data to backend:', telegramData);
    console.log('Backend URL:', TELEGRAM_AUTH_URL);
    const response = await fetch(TELEGRAM_AUTH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: telegramData.id,
        username: telegramData.username,
        photo_url: telegramData.photo_url,
        auth_date: telegramData.auth_date,
        hash: telegramData.hash,
        first_name: telegramData.first_name,
        last_name: telegramData.last_name,
      }),
    });

    console.log('Backend response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Authentication failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return data; // { access_token, token_type }
  } catch (error) {
    console.error('telegramLogin error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to authenticate with Telegram');
  }
};

// src/api/auth.ts
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No access token available');
  }

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('access_token');
      throw new Error('Token expired');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    return fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error('Token validation error:', err);
    throw err;
  }
};

