'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios, { setAuthToken } from '../../../../config/axios.config';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type User = any; // Accept any structure for user data

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token decryption function
async function decryptToken(
  encryptedBase64: string,
  secretKey: string
): Promise<string> {
  const enc = new TextEncoder();
  const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) =>
    c.charCodeAt(0)
  );

  const iv = encryptedBytes.slice(0, 12); // first 12 bytes = IV
  const encryptedData = encryptedBytes.slice(12); // rest = actual ciphertext

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(process.env.NEXT_PUBLIC_SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['decrypt']
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleToken = async () => {
      // Extract token from URL
      const url = new URL(window.location.href);
      const urlToken = url.searchParams.get('token');
      const secret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET ?? '';

      if (!secret) {
        toast.error('Unauthorized action');
        return;
      }

      if (urlToken) {
        try {
          // Decrypt the token
          const decryptedToken = await decryptToken(urlToken, secret);
          console.log('Decrypted token:', decryptedToken);

          setTokenState(decryptedToken);
          setAuthToken(decryptedToken);
          Cookies.set('auth_token', decryptedToken, { expires: 7 });

          // Clean up URL by removing the token parameter
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('token');
          window.history.replaceState({}, '', newUrl.toString());
        } catch (err) {
          console.error('Failed to decrypt token:', err);
          toast.error('Invalid token');
          // Redirect to auth page on decryption failure
          window.location.href = 'https://instanvi-auth.vercel.app';
        }
      } else {
        // If no token in URL, try to load from cookie
        const cookieToken = Cookies.get('auth_token');
        if (cookieToken) {
          setTokenState(cookieToken);
          setAuthToken(cookieToken);
        }
      }
    };

    handleToken();
  }, []);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      Cookies.set('auth_token', token, { expires: 7 });
      setIsLoading(true);
      axios
        .get('/whoami')
        .then((res) => {
          setUser(res.data.user);
          setIsLoading(false);
        })
        .catch(() => {
          setUser(null);
          setIsLoading(false);
          // If token is invalid, redirect to auth
          Cookies.remove('auth_token');
          window.location.href = 'https://instanvi-auth.vercel.app';
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const setToken = (t: string) => {
    setTokenState(t);
    setAuthToken(t);
    Cookies.set('auth_token', t, { expires: 7 });
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setToken,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
