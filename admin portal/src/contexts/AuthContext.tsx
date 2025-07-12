// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  sub: string; // Telegram user ID
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  email?: string;
  role?: string;
  [key: string]: any; // Allow additional fields from JWT
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  setAuth: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (token: string | null) => {
    if (token) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('access_token', token);
      setIsAuthenticated(true);
      setAccessToken(token);
      try {
        const decoded: User = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Failed to decode JWT:', err);
        setUser(null);
      }
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('access_token');
      setIsAuthenticated(false);
      setAccessToken(null);
      setUser(null);
    }
  };

  const logout = () => {
    setAuth(null);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('access_token');
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
      setAccessToken(token);
      if (token) {
        try {
          const decoded: User = jwtDecode(token);
          setUser(decoded);
        } catch (err) {
          console.error('Failed to decode JWT:', err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Initial check
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};