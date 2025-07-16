import { jwtDecode } from 'jwt-decode';

export interface TelegramCodeRequest {
  username: string;
}

export interface TelegramCodeVerify {
  username: string;
  code: string;
}

export const requestTelegramCode = async (data: TelegramCodeRequest): Promise<{ code: string }> => {
  const username = data.username.replace(/^@/, ''); // Normalize username
  console.log('Mock: Requesting code for username:', username);

  // Generate mock 4-digit code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  console.log('Mock: Generated code:', code);
  return { code };
};

export const verifyTelegramCode = async (data: TelegramCodeVerify): Promise<{ access_token: string }> => {
  const username = data.username.replace(/^@/, '');
  console.log('Mock: Verifying code for username:', username, 'Code:', data.code);

  // Simulate verification (UI validates code)
  const access_token = `mock_jwt_${username}_${Date.now()}`;
  console.log('Mock: Code verified, generated token:', access_token);
  return { access_token };
};

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
