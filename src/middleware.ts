import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export default async function middileware(_req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(`${process.env.APP_DOMAIN}/login`);
  }
}

export const config = {
  matcher: ['/((?!api|login|_next/static|_next/image|favicon.ico).*)'],
};
