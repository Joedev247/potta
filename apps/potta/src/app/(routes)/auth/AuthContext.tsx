'use client';
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import axios, { setAuthToken } from '../../../../config/axios.config';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Configuration constants
const AUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://instanvi-auth.vercel.app';
const BYPASS_AUTH_ROUTES = [
  '/vendor-portal',
  // Add more routes here as needed
  // '/client-portal',
  // '/public-api',
];

// Types
type User = any; // Accept any structure for user data

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token decryption function using AES-GCM with SHA256 key derivation
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
      salt: enc.encode(process.env.NEXT_PUBLIC_SALT || 'default-salt'),
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

  // Memoized route detection to avoid unnecessary recalculations
  const isBypassRoute = useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    const currentPath = window.location.pathname;
    return BYPASS_AUTH_ROUTES.some(route => currentPath.includes(route));
  }, []);

  useEffect(() => {
    const handleToken = async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext: Starting token handling...');
      }

      // Skip token processing for bypass routes
      if (isBypassRoute) {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext: Bypass route detected, skipping token processing');
        }
        setIsLoading(false);
        return;
      }

      // Check if we're on localhost
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1';

      if (isLocalhost) {
        // Use test token for localhost development
        const testToken = 'Imri5dthC8rhyw5TO3Q0BptsocM0yWt7';
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext: Running on localhost - using test token');
        }
        setTokenState(testToken);
        setAuthToken(testToken);
        Cookies.set('auth_token', testToken, { expires: 7 });
        setIsLoading(false);
        return;
      }

      // Extract token from URL for production
      const url = new URL(window.location.href);
      const urlToken = url.searchParams.get('token');
      const secret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET ?? '';

      if (process.env.NODE_ENV === 'development') {
        console.log('AuthContext: URL token found:', !!urlToken);
        console.log('AuthContext: Secret available:', !!secret);
      }

      if (urlToken && secret) {
        try {
          // Decrypt the token
          const decryptedToken = await decryptToken(urlToken, secret);
          if (process.env.NODE_ENV === 'development') {
            console.log('AuthContext: Successfully decrypted token:', decryptedToken);
          }

          setTokenState(decryptedToken);
          setAuthToken(decryptedToken);
          Cookies.set('auth_token', decryptedToken, { expires: 7 });

          // Clean up URL by removing the token parameter
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('token');
          newUrl.searchParams.delete('redirectUrl');
          window.history.replaceState({}, '', newUrl.toString());
        } catch (err) {
          console.error('AuthContext: Failed to decrypt token:', err);
          toast.error('Invalid token');
        }
      } else {
        // If no token in URL, try to load from cookie
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext: No URL token, checking cookies...');
        }
        const cookieToken = Cookies.get('auth_token');
        if (cookieToken) {
          if (process.env.NODE_ENV === 'development') {
            console.log('AuthContext: Found token in cookies');
          }
          setTokenState(cookieToken);
          setAuthToken(cookieToken);
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('AuthContext: No token found in cookies');
          }
        }
      }

      setIsLoading(false);
    };

    handleToken();
  }, [isBypassRoute]);

  useEffect(() => {
    const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

    if (token) {
      setAuthToken(token);
      Cookies.set('auth_token', token, { expires: 7 });

      if (devMode) {
        if (process.env.NODE_ENV === 'development') {
          console.log('AuthContext: DEV MODE active – skipping /whoami check');
        }
        setUser({ name: 'Dev User', role: 'developer' }); // Dummy user
        setIsLoading(false);
      } else {
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
            Cookies.remove('auth_token');
          });
      }
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const setToken = (t: string) => {
    setTokenState(t);
    setAuthToken(t);
    Cookies.set('auth_token', t, { expires: 7 });
  };

  const signOut = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('AuthContext: Signing out...');
    }

    // Clear token state
    setTokenState(null);
    setUser(null);

    // Clear auth token from axios
    setAuthToken('');

    // Clear cookies
    Cookies.remove('auth_token');

    // Clear any other auth-related cookies
    document.cookie =
      'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setToken,
        signOut,
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
