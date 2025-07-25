'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios, { setAuthToken } from '../../../../config/axios.config';
import Cookies from 'js-cookie';

type User = any; // Accept any structure for user data

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Extract token from URL
    const url = new URL(window.location.href);
    const urlToken = url.searchParams.get('token');
    if (urlToken) {
      setTokenState(urlToken);
      setAuthToken(urlToken);
      Cookies.set('auth_token', urlToken, { expires: 7 });
    } else {
      // If no token in URL, try to load from cookie
      const cookieToken = Cookies.get('auth_token');
      if (cookieToken) {
        setTokenState(cookieToken);
        setAuthToken(cookieToken);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      Cookies.set('auth_token', token, { expires: 7 });
      axios
        .get('/whoami')
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null));
    }
  }, [token]);

  const setToken = (t: string) => {
    setTokenState(t);
    setAuthToken(t);
    Cookies.set('auth_token', t, { expires: 7 });
  };

  return (
    <AuthContext.Provider value={{ user, token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
