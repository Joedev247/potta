import Axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
  AxiosError,
} from 'axios';

// Configuration constants
const AUTH_REDIRECT_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || 'https://instanvi-auth.vercel.app';
const BYPASS_AUTH_REDIRECT_ROUTES = [
  '/vendor-portal',
  // Add more routes here as needed
  // '/client-portal',
  // '/public-api',
];

// Create axios instance
const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Token management
let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
}

function getTokenFromCookies(): string | null {
  if (typeof window !== 'undefined') {
    // Get token from cookies
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('auth_token')
    );
    if (authCookie) {
      return authCookie.split('=')[1];
    }
  }
  return null;
}

function isBypassRoute(): boolean {
  if (typeof window === 'undefined') return false;

  const currentPath = window.location.pathname;
  return BYPASS_AUTH_REDIRECT_ROUTES.some((route) =>
    currentPath.includes(route)
  );
}

function clearAuthCookies(): void {
  if (typeof window === 'undefined') return;

  document.cookie =
    'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function redirectToUnauthorized(): void {
  if (typeof window === 'undefined') return;

  // Instead of redirecting to auth, redirect to unauthorized page
  window.location.href = '/unauthorized';
}

// Request interceptor
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Ensure headers object exists
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  // Handle Content-Type for different data types
  if (
    !config.headers['Content-Type'] &&
    !config.data?.toString().includes('FormData')
  ) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Remove Content-Type for FormData (browser will set it with boundary)
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type');
  }

  // Add authorization header for non-vendor portal routes
  const token = authToken || getTokenFromCookies();
  const isVendorPortal = isBypassRoute();

  if (token && !isVendorPortal) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Development logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('REQUEST:', {
      url: (config.baseURL || '') + (config.url || ''),
      method: config.method,
      headers: config.headers,
      data:
        config.data instanceof FormData
          ? 'FormData (file upload)'
          : config.data,
      params: config.params,
    });
  }

  return config;
});

// Response interceptor (single, unified)
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('RESPONSE:', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    // Development logging
    if (process.env.NODE_ENV === 'development') {
      console.log('RESPONSE ERROR:', {
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      const isBypass = isBypassRoute();
      const isLocalhost =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1');

      if (isBypass) {
        // For bypass routes, let component handle the error
        console.log(
          'Bypass route detected: Invalid token, not redirecting to auth'
        );
        return Promise.reject(error);
      } else if (isLocalhost) {
        // For localhost development, show unauthorized page instead of redirecting
        console.log(
          'Localhost detected: Invalid token, redirecting to unauthorized page'
        );

        redirectToUnauthorized();
        return Promise.reject(error);
      } else {
        // For production, clear cookies and redirect to auth
        console.log('Production: Invalid token, redirecting to auth');
        clearAuthCookies();
        window.location.href = AUTH_REDIRECT_URL;
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
