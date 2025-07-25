import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth page URL
const AUTH_URL = 'https://instanvi-auth.vercel.app';

// Public paths that don't require authentication
const publicPaths = [
  '/auth',
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/icons',
  '/fonts',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for token in cookies or URL
  const token = request.cookies.get('auth_token')?.value;
  const urlToken = request.nextUrl.searchParams.get('token');

  // If no token in cookies or URL, redirect to auth page
  if (!token && !urlToken) {
    const authUrl = new URL(AUTH_URL);
    // Add the current URL as a redirect parameter
    authUrl.searchParams.set('redirect', request.url);
    return NextResponse.redirect(authUrl);
  }

  // If token exists, allow the request to proceed
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|fonts).*)',
  ],
};
