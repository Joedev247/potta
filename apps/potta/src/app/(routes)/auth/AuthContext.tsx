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
      console.log('AuthContext: Starting token handling...');

      // Extract token from URL
      const url = new URL(window.location.href);
      const urlToken = url.searchParams.get('token');
      const secret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET ?? '';

      console.log('AuthContext: URL token found:', !!urlToken);
      console.log('AuthContext: Secret available:', !!secret);

      if (!secret) {
        console.error('AuthContext: No encryption secret found');
        toast.error('Unauthorized action');
        return;
      }
      const testToken = 'fBvi2vOVcW856X6gNkNScouXTdEr6jMj';

      if (urlToken || testToken) {
        console.log('AuthContext: Processing URL token...');

        // Check if we're on localhost
        const isLocalhost =
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        if (isLocalhost) {
          console.log('AuthContext: Running on localhost - using test token');
          setTokenState(testToken);
          setAuthToken(testToken);
          Cookies.set('auth_token', testToken, { expires: 7 });
        } else {
          try {
            // Decrypt the token
            const decryptedToken = await decryptToken(
              urlToken || testToken,
              secret
            );
            console.log(
              'AuthContext: Successfully decrypted token:',
              decryptedToken
            );

            setTokenState(decryptedToken);
            setAuthToken(decryptedToken);
            Cookies.set('auth_token', decryptedToken, { expires: 7 });
          } catch (err) {
            console.error('AuthContext: Failed to decrypt token:', err);
            toast.error('Invalid token');
            // Redirect to auth page on decryption failure
            window.location.href = 'https://instanvi-auth.vercel.app';
          }
        }

        // Clean up URL by removing the token parameter
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('token');
        newUrl.searchParams.delete('redirectUrl'); // Also clean up redirectUrl if present
        window.history.replaceState({}, '', newUrl.toString());

        console.log('AuthContext: Token processed and URL cleaned');
      } else {
        console.log('AuthContext: No URL token, checking cookies...');
        // If no token in URL, try to load from cookie
        const cookieToken = Cookies.get('auth_token');
        if (cookieToken) {
          console.log('AuthContext: Found token in cookies');
          setTokenState(cookieToken);
          setAuthToken(cookieToken);
        } else {
          console.log('AuthContext: No token found in cookies');
        }
      }
    };

    handleToken();
  }, []);

  useEffect(() => {
    const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

    if (token) {
      setAuthToken(token);
      Cookies.set('auth_token', token, { expires: 7 });

      if (devMode) {
        console.log('AuthContext: DEV MODE active – skipping /whoami check');
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
            window.location.href = 'https://instanvi-auth.vercel.app';
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
    console.log('AuthContext: Signing out...');

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

    // Redirect to auth page
    window.location.href = 'https://instanvi-auth.vercel.app';
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
