import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set permissive CSP for development
  const cspHeader = process.env.NODE_ENV === 'development'
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https:; img-src 'self' data: https:; connect-src 'self' http: https:;"
    : "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https:; img-src 'self' data: https:; connect-src 'self' https:;";

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
