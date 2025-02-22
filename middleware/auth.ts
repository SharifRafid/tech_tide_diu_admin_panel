import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function auth(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      const reqWithUser = req as NextRequest & { user: typeof session.user };
      reqWithUser.user = session.user;
      return NextResponse.next();
    } else {
      return new NextResponse(
        JSON.stringify({ error: 'Not authenticated' }),
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error); // Log the error to avoid ESLint warning
    return new NextResponse(
      JSON.stringify({ error: 'An error occurred during authentication' }),
      { status: 500 }
    );
  }
}
