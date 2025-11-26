import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/sell',
  '/preferences',
  '/favorites',
];

// Define routes that require verification
const VERIFICATION_REQUIRED_ROUTES = [
  '/sell',
  '/profile/edit',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware checking path:', pathname);

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    console.log('✅ Not a protected route, allowing access');
    return NextResponse.next();
  }

  console.log('🔒 Protected route detected');

  // Check for token in cookies
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;
  console.log('🍪 Token from cookie:', token ? 'Found' : 'Not found');

  // Verify token
  const payload = token ? await verifyToken(token) : null;
  console.log('👤 Token payload:', payload ? 'Valid' : 'Invalid/Missing');

  // If not authenticated, redirect to signin
  if (!payload) {
    console.log('❌ User not authenticated, redirecting to signin');
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = '/signin';
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  console.log('✅ User authenticated:', payload.email);

  // Check if route requires verification
  const requiresVerification = VERIFICATION_REQUIRED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // If verification required but user not verified, redirect to verify page
  if (requiresVerification && !payload.verified) {
    console.log('⚠️ User not verified, redirecting to verify page');
    const verifyUrl = new URL('/verify', request.url);
    return NextResponse.redirect(verifyUrl);
  }

  console.log('✅ User is authenticated and verified, allowing access');
  // User is authenticated (and verified if required), allow access
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
