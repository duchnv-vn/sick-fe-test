import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middileware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|_next/static|_next/image|favicon.ico).*)'],
};
