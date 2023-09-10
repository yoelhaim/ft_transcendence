import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  let passcode = request.cookies.get('passcode');
  let userId = request.cookies.get('userId');
  let firsttime = request.cookies.get('firstTime');
  let token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;

  if (passcode && pathname !== '/two-factor-verification')
    return NextResponse.redirect(
      new URL('/two-factor-verification', request.url),
    );
  else {
    if (pathname !== `/firsttime` && firsttime)
      return NextResponse.redirect(new URL(`/firsttime?u=${userId?.value}`, request.url));
    if (pathname !== '/login' && !token)
      return NextResponse.redirect(new URL('/login', request.url));
    if (
      (pathname === '/login') &&
      token
    )
      return NextResponse.redirect(new URL('/', request.url));
    if (
      (pathname === '/firsttime') &&
      token && !firsttime
    )
      return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|images|_next|icons|img|icons/logout.svg|img/logo.svg|_next/static/css/app|icons/google_logo.svg|logo42.svg|logo.svg|favicon.ico).*)',
  ],
};
