import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Environment-based configuration
const getConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const authUrl =
    process.env.NEXT_PUBLIC_AUTH_URL || 'https://instanvi-auth.vercel.app';

  return {
    authUrl,
    isDevelopment,
    enableLogging: isDevelopment,
  };
};

// Public paths that don't require authentication
const PUBLIC_PATHS = [
  '/auth',
  '/api/public',
  '/_next',
  '/favicon.ico',
  '/images',
  '/icons',
  '/fonts',
  '/vendor-portal',
  '/vendor/kyc/verify', // KYC verification portal (token-based access)
  '/vendor/rfqs', // Vendor RFQ portal (token-based access)
  '/public',
];

// API routes that don't require authentication
const PUBLIC_API_ROUTES = ['/api/health', '/api/status', '/api/public'];

// Static file extensions
const STATIC_EXTENSIONS = [
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const config = getConfig();

  // Log request in development
  if (config.enableLogging) {
    console.log(`[Middleware] ${request.method} ${pathname}`);
  }

  // Early return for Next.js internal paths (should be excluded by matcher, but double-check)
  if (pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Check if it's a static file
  const isStaticFile = STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  if (isStaticFile) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    if (config.enableLogging) {
      console.log(`[Middleware] Public path, allowing access: ${pathname}`);
    }
    return NextResponse.next();
  }

  // Check if it's a public API route
  const isPublicApi = PUBLIC_API_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicApi) {
    return NextResponse.next();
  }

  // Get tokens from various sources
  const cookieToken = request.cookies.get('auth_token')?.value;
  const headerToken = request.headers
    .get('authorization')
    ?.replace('Bearer ', '');
  const urlToken = request.nextUrl.searchParams.get('token');

  // Token priority: URL > Header > Cookie
  const token = urlToken || headerToken || cookieToken;

  // Handle token in URL (encrypted token from auth service)
  if (urlToken) {
    if (config.enableLogging) {
      console.log(
        '[Middleware] Token found in URL, allowing request to proceed'
      );
    }

    // Create response with same-origin policy headers for security
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
  }

  // Development mode bypass
  if (config.isDevelopment) {
    const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN || 'dev-token';

    if (!token) {
      if (config.enableLogging) {
        console.log(
          '[Middleware] Development mode: No token found, using dev token'
        );
      }

      // Set dev token in cookie
      const response = NextResponse.next();
      response.cookies.set('auth_token', devToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });

      return response;
    }
  }

  // No token found, redirect to auth
  if (!token) {
    if (config.enableLogging) {
      console.log('[Middleware] No token found, redirecting to auth');
    }

    // For API routes, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // For page routes, redirect to auth
    const authUrl = new URL(config.authUrl);
    authUrl.searchParams.set('redirectUrl', request.url);

    // Add origin for CORS validation
    authUrl.searchParams.set('origin', request.nextUrl.origin);

    return NextResponse.redirect(authUrl);
  }

  // Token exists, validate format (basic validation)
  if (token && token.length < 10) {
    if (config.enableLogging) {
      console.log('[Middleware] Invalid token format');
    }

    // Clear invalid token
    const response = NextResponse.next();
    response.cookies.delete('auth_token');

    // Redirect to auth
    const authUrl = new URL(config.authUrl);
    authUrl.searchParams.set('redirectUrl', request.url);
    return NextResponse.redirect(authUrl);
  }

  // Add security headers to response
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://app.instanvi.com',
      'https://instanvi-auth.vercel.app',
    ];

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      );
    }
  }

  // Refresh token cookie if it exists (extend expiry)
  if (cookieToken) {
    response.cookies.set('auth_token', cookieToken, {
      httpOnly: false,
      secure: !config.isDevelopment,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (all Next.js internal paths including static files, chunks, etc.)
     * - favicon.ico, robots.txt (metadata files)
     * - public folder
     * - static files (js, css, images, fonts, etc.)
     */
    '/((?!_next|favicon.ico|robots.txt|public|.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)).*)',
  ],
};
