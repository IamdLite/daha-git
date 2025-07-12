// /src/api/auth.ts
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
    const response = await fetch("http://daha.linkpc.net/auth/telegram", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: telegramData.id,
        username: telegramData.username,
        photo_url: telegramData.photo_url,
        auth_date: telegramData.auth_date,
        hash: telegramData.hash,
      }),
    });

    if (!response.ok) {
      throw new Error("Authentication failed");
    }

    const data = await response.json();
    return data; // { access_token, token_type }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to authenticate with Telegram");
  }
};