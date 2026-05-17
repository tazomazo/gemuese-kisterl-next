import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, parseCookieUser } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin/* routes
  if (pathname.startsWith('/admin')) {
    const cookieValue = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!cookieValue) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const user = parseCookieUser(cookieValue);
    if (!user?.is_admin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
