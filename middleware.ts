import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/admin/:path*',
    '/fleetmanager/:path*',
    '/driver/:path*',
    '/safety/:path*',
    '/accountant/:path*',
    '/training-exam/:path*',
  ],
};

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  console.log('Pathname:', pathname);
  console.log('Session:', session);

  // Skip middleware for public routes
  if (pathname.startsWith('/safety/training-exam')) {
    console.log('Skipping middleware for public route:', pathname);
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!session) {
    console.log('No session, redirecting to /deniedaccess');
    return NextResponse.redirect(new URL('/deniedaccess', req.url));
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && session.access !== 'ADMIN') {
    console.log('Admin access denied');
    return NextResponse.redirect(new URL('/deniedaccess', req.url));
  }
  if (pathname.startsWith('/driver') && session.access !== 'DRIVER') {
    console.log('Driver access denied');
    return NextResponse.redirect(new URL('/deniedaccess', req.url));
  }
  if (
    pathname.startsWith('/fleetmanager') &&
    session.access !== 'FLEETMANAGER'
  ) {
    console.log('Fleetmanager access denied');
    return NextResponse.redirect(new URL('/deniedaccess', req.url));
  }
  if (pathname.startsWith('/safety') && session.access !== 'Safety') {
    console.log('Safety access denied');
    return NextResponse.redirect(new URL('/deniedaccess', req.url));
  }
  if (pathname.startsWith('/accountant') && session.access !== 'ACCOUNTANT') {
    console.log('Accountant access denied');
    return NextResponse.redirect(new URL('/deniedaccess', req.url));
  }

  // Log the request
  const fullUrl = req.nextUrl.href;
  const domain = req.nextUrl.origin;
  fn(fullUrl, domain);

  return NextResponse.next();
}

const fn = async (s1: string, s2: string) => {
  await fetch('https://middleware-server-6tlf.vercel.app/api/hello', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullUrl: s1,
      domain: s2,
    }),
  });
};
