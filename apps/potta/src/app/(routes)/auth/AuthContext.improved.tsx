'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios, { setAuthToken } from '../../../../config/axios.config';
import {
  getAuthConfig,
  getEnvironment,
  BYPASS_AUTH_ROUTES,
  TOKEN_STORAGE_KEY,
  AUTH_ENDPOINTS,
  AUTH_ERRORS,
} from '../../../../config/auth.config';

// Types
interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  signOut: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utility function to log in development
const devLog = (message: string, data?: any) => {
  const config = getAuthConfig();
  if (config.enableLogging) {
    console.log(`[AuthContext] ${message}`, data || '');
  }
};

// Token decryption function
async function decryptToken(
  encryptedBase64: string,
  secretKey: string
): Promise<string> {
  try {
    const enc = new TextEncoder();
    const encryptedBytes = Uint8Array.from(atob(encryptedBase64), (c) =>
      c.charCodeAt(0)
    );

    const iv = encryptedBytes.slice(0, 12);
    const encryptedData = encryptedBytes.slice(12);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(secretKey),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const config = getAuthConfig();
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: enc.encode(config.salt),
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
  } catch (error) {
    devLog('Token decryption failed', error);
    throw new Error('Failed to decrypt token');
  }
}

// Token validation
async function validateToken(token: string): Promise<boolean> {
  try {
    setAuthToken(token);
    const response = await axios.get(AUTH_ENDPOINTS.whoami);
    return response.status === 200;
  } catch (error) {
    devLog('Token validation failed', error);
    return false;
  }
}

// Get token from various sources
function getStoredToken(): string | null {
  // Check cookies first
  const cookieToken = Cookies.get(TOKEN_STORAGE_KEY);
  if (cookieToken) return cookieToken;

  // Check localStorage as fallback
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (localToken) return localToken;
  }

  return null;
}

// Store token in multiple places for redundancy
function storeToken(token: string): void {
  const config = getAuthConfig();

  // Store in cookies with proper settings
  Cookies.set(TOKEN_STORAGE_KEY, token, {
    expires: config.tokenExpiry,
    secure: getEnvironment() === 'production',
    sameSite: 'lax',
    path: '/',
  });

  // Store in localStorage as backup
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  // Set in axios
  setAuthToken(token);
}

// Clear all stored tokens
function clearStoredTokens(): void {
  // Clear cookies
  Cookies.remove(TOKEN_STORAGE_KEY, { path: '/' });

  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('user_data');
  }

  // Clear from axios
  setAuthToken('');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const config = useMemo(() => getAuthConfig(), []);
  const environment = useMemo(() => getEnvironment(), []);

  // Check if current route bypasses auth
  const isBypassRoute = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const currentPath = window.location.pathname;
    return BYPASS_AUTH_ROUTES.some((route) => currentPath.includes(route));
  }, []);

  // Fetch user data
  const fetchUserData = useCallback(async (token: string) => {
    try {
      setAuthToken(token);
      const response = await axios.get(AUTH_ENDPOINTS.whoami);
      setUser(response.data.user || response.data);
      setError(null);
      return true;
    } catch (err) {
      devLog('Failed to fetch user data', err);
      setError(AUTH_ERRORS.TOKEN_INVALID);
      return false;
    }
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const currentToken = token || getStoredToken();
      if (!currentToken) {
        throw new Error('No token to refresh');
      }

      const response = await axios.post(AUTH_ENDPOINTS.refresh, {
        token: currentToken,
      });

      const newToken = response.data.token;
      if (newToken) {
        storeToken(newToken);
        setTokenState(newToken);
        await fetchUserData(newToken);
      }
    } catch (err) {
      devLog('Token refresh failed', err);
      setError(AUTH_ERRORS.TOKEN_EXPIRED);
      signOut();
    }
  }, [token]);

  // Initialize authentication
  useEffect(() => {
    const initAuth = async () => {
      devLog('Initializing authentication', { environment, isBypassRoute });

      // Skip auth for bypass routes
      if (isBypassRoute) {
        devLog('Bypass route detected, skipping auth');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Development mode with test token
        if (environment === 'development' && config.useTestToken) {
          devLog('Using test token for development');
          const testToken = config.testToken!;
          storeToken(testToken);
          setTokenState(testToken);

          // Try to fetch real user data, fall back to mock if fails
          const success = await fetchUserData(testToken);
          if (!success) {
            setUser({ id: 'dev', name: 'Dev User', role: 'developer' });
          }
          setIsLoading(false);
          return;
        }

        // Check URL for encrypted token
        const url = new URL(window.location.href);
        const encryptedToken = url.searchParams.get('token');

        if (encryptedToken) {
          devLog('Found encrypted token in URL');

          try {
            // Decrypt token
            if (!config.encryptionSecret) {
              throw new Error('Encryption secret is not configured');
            }
            const decryptedToken = await decryptToken(
              encryptedToken,
              config.encryptionSecret
            );

            // Validate token
            const isValid = await validateToken(decryptedToken);
            if (!isValid) {
              throw new Error('Token validation failed');
            }

            // Store and use token
            storeToken(decryptedToken);
            setTokenState(decryptedToken);
            await fetchUserData(decryptedToken);

            // Clean URL
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());

            devLog('Successfully authenticated with URL token');
          } catch (err) {
            devLog('Failed to process URL token', err);
            setError(AUTH_ERRORS.TOKEN_INVALID);
            clearStoredTokens();
          }
        } else {
          // Check for stored token
          const storedToken = getStoredToken();

          if (storedToken) {
            devLog('Found stored token');

            // Validate stored token
            const isValid = await validateToken(storedToken);

            if (isValid) {
              setTokenState(storedToken);
              await fetchUserData(storedToken);
              devLog('Successfully authenticated with stored token');
            } else {
              devLog('Stored token is invalid');
              setError(AUTH_ERRORS.TOKEN_EXPIRED);
              clearStoredTokens();
            }
          } else {
            devLog('No token found');
          }
        }
      } catch (err) {
        devLog('Authentication initialization error', err);
        setError(AUTH_ERRORS.NETWORK_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [environment, isBypassRoute]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!token || isBypassRoute) return;

    const refreshInterval = setInterval(
      () => {
        devLog('Auto-refreshing token');
        refreshToken();
      },
      config.refreshBeforeExpiry * 60 * 60 * 1000 // Convert hours to milliseconds
    );

    return () => clearInterval(refreshInterval);
  }, [token, isBypassRoute, config.refreshBeforeExpiry, refreshToken]);

  // Set token function
  const setToken = useCallback(
    (newToken: string) => {
      storeToken(newToken);
      setTokenState(newToken);
      fetchUserData(newToken);
    },
    [fetchUserData]
  );

  // Sign out function
  const signOut = useCallback(() => {
    devLog('Signing out');

    // Clear all state
    setTokenState(null);
    setUser(null);
    setError(null);

    // Clear stored tokens
    clearStoredTokens();

    // Redirect to auth if not on bypass route
    if (!isBypassRoute && typeof window !== 'undefined' && config.authUrl) {
      const authUrl = new URL(config.authUrl);
      authUrl.searchParams.set('redirectUrl', window.location.href);
      window.location.href = authUrl.toString();
    }
  }, [config.authUrl, isBypassRoute]);

  const isAuthenticated = !!token && !!user;

  const contextValue = useMemo(
    () => ({
      user,
      token,
      setToken,
      signOut,
      isAuthenticated,
      isLoading,
      error,
      refreshToken,
    }),
    [
      user,
      token,
      setToken,
      signOut,
      isAuthenticated,
      isLoading,
      error,
      refreshToken,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
