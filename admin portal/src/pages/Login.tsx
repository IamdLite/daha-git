// src/components/Login.tsx
import  { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ChangeThemes from '../components/ChangesThemes';
import { telegramLogin, TelegramUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

export const TELEGRAM_BOT_NAME = 'daha40_bot';
export const TELEGRAM_AUTH_URL = 'https://daha.linkpc.net/auth/telegram'; // Or ngrok URL for local testing

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    console.log('URL Params:', params.toString(), 'Token:', token);
    if (token) {
      setAuth(token);
      toast.success('Login successful!');
      navigate('/home');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate, setAuth]);

  useEffect(() => {
    if (widgetContainerRef.current && !widgetContainerRef.current.hasChildNodes()) {
      widgetContainerRef.current.innerHTML = '';

      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', TELEGRAM_BOT_NAME);
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-auth-url', TELEGRAM_AUTH_URL);
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-radius', '12');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');

      (window as any).onTelegramAuth = (user: TelegramUser) => {
        console.log('Telegram Auth Data:', user);
        telegramLogin(user)
          .then((response) => {
            console.log('Backend Response:', response);
            setAuth(response.access_token);
            toast.success('Login successful!');
            navigate('/home');
          })
          .catch((error) => {
            console.error('Login Error:', error);
            setWidgetError(error.message || 'Authentication failed. Check console for details.');
          });
      };

      script.onload = () => {
        console.log('Telegram widget loaded');
        setWidgetLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Telegram widget');
        setWidgetError('Failed to load Telegram Login Widget.');
      };

      widgetContainerRef.current.appendChild(script);
    }

    return () => {
      if (widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = '';
      }
      delete (window as any).onTelegramAuth;
    };
  }, [navigate, setAuth]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
      }}
    >
      <div
        style={{
          minWidth: 340,
          maxWidth: 380,
          padding: '2.5rem 2rem 2rem 2rem',
          borderRadius: 18,
          background: '#fff',
          boxShadow: '0 6px 32px 0 rgba(60,72,88,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <ChangeThemes />
        </div>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#3b3b3b', letterSpacing: 0.5 }}>
            DAHA Admin Portal
          </span>
        </div>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: '#6366f1' }}>
            Hello, 👋 Welcome Back!
          </span>
        </div>
        <div
          ref={widgetContainerRef}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 48,
            width: '100%',
            margin: '16px 0 8px 0',
          }}
        ></div>
        {widgetError && (
          <div style={{ color: '#ef4444', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
            {widgetError}
            <br />
            Please verify:
            <br />
            1. Bot name (@pooocheeemy_bot) is correct
            <br />
            2. Domain is whitelisted in BotFather
            <br />
            3. Backend URL is accessible (HTTPS)
            <br />
            4. Check browser console for errors
          </div>
        )}
        {!widgetLoaded && !widgetError && (
          <div style={{ color: '#6366f1', fontSize: 14, textAlign: 'center' }}>
            Loading Telegram Login Widget...
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;