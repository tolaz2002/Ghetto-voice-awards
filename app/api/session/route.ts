import { NextRequest, NextResponse } from 'next/server';
import { createOrGetSession, getVoterSession } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const clientSessionId = body.sessionId || req.cookies.get('gva_session')?.value || `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const forwarded = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipHash = Buffer.from(forwarded.split(',')[0].trim()).toString('base64').slice(0, 12);
    const phone = body.phone;

    const session = createOrGetSession(clientSessionId, ipHash, phone);

    const res = NextResponse.json({ success: true, session });
    res.cookies.set('gva_session', session.id, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: 'lax',
    });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('sessionId') || req.cookies.get('gva_session')?.value;
  if (!sessionId) {
    return NextResponse.json({ session: null });
  }
  const session = getVoterSession(sessionId);
  return NextResponse.json({ session });
}
