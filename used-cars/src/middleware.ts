import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthUser } from './lib/auth';

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

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get authenticated user
  const user = await getAuthUser(request);

  // If not authenticated, redirect to signin
  if (!user) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check if route requires verification
  const requiresVerification = VERIFICATION_REQUIRED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // If verification required but user not verified, redirect to verify page
  if (requiresVerification && !user.verified) {
    const verifyUrl = new URL('/verify', request.url);
    return NextResponse.redirect(verifyUrl);
  }

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
