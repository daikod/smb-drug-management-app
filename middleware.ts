// ============================================
// Middleware for Route Protection
// ============================================

// middleware.ts (root level)
import { stackServerApp } from '@/stack/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard and drug management routes
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/drugs') ||
      pathname.startsWith('/inventory')) {
    
    const user = await stackServerApp.getUser();
    
    if (!user) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/drugs/:path*',
    '/inventory/:path*',
    '/api/drugs/:path*',
  ],
};