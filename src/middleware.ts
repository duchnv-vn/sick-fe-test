import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export default async function middileware(req: NextRequest) {
  const originalPathName = req.nextUrl.pathname;
  const isAuthApiRequest = originalPathName.includes('/api/auth/');
  const isApiRequest = originalPathName.includes('/api/');

  if (isAuthApiRequest) return NextResponse.next();

  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(`${process.env.APP_DOMAIN}/login`);
  }

  if (isApiRequest) {
    const { accessToken } = session;
    const newUrl = req.nextUrl.clone();
    newUrl.href = `${process.env.AUTH0_AUDIENCE}`;
    newUrl.pathname = originalPathName;
    const newHeaders = new Headers({ authorization: `Bearer ${accessToken}` });

    return NextResponse.rewrite(newUrl, {
      request: { headers: newHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
};
