import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login');

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (isAuthPage) {
      if (token) {
        const payload = await verifyAdminToken(token);
        if (payload) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyAdminToken(token);
    if (!payload) {
      const response = NextResponse.redirect(
        new URL('/admin/login', request.url),
      );
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
