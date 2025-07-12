// src/types/telegram.d.ts
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            photo_url?: string;
          };
        };
      };
      Login?: {
        auth?: (options: {
          bot_id: string;
          request_access?: boolean;
          lang?: string;
          onAuthCallback?: (user: TelegramUser) => void;
        }) => void;
      };
    };
  }
}

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}