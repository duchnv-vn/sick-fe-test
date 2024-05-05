import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { Session, getSession } from '@auth0/nextjs-auth0/edge';
import { HttpMethods } from './utils/enum/http';
import { NextURL } from 'next/dist/server/web/next-url';

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
    return await handleApiRequest(session, req);
  }

  return NextResponse.next();
}

const handleApiRequest = async (session: Session, req: NextRequest) => {
  const { accessToken } = session;
  const newHeaders = new Headers({
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  });

  const originalPathName = req.nextUrl.pathname;
  const newUrl = req.nextUrl.clone();
  newUrl.href = `${process.env.AUTH0_AUDIENCE}`;
  newUrl.pathname = originalPathName;

  if ([HttpMethods.POST, HttpMethods.PUT]) {
    newHeaders.set('Content-Type', 'application/json');
  }

  return NextResponse.rewrite(newUrl, {
    request: { headers: newHeaders },
  });
};

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
};
