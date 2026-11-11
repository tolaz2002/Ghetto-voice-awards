import { NextRequest, NextResponse } from 'next/server';
import { recordFirstVote, createOrGetSession } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { artistId, phone, captchaAnswer, captchaExpected } = body;

    // Simple anti-bot validation
    if (captchaExpected !== undefined && captchaAnswer !== undefined) {
      if (parseInt(String(captchaAnswer), 10) !== parseInt(String(captchaExpected), 10)) {
        return NextResponse.json({ success: false, message: 'Bot verification check failed. Please solve the math challenge.' }, { status: 400 });
      }
    }

    let sessionId = body.sessionId || req.cookies.get('gva_session')?.value;
    const forwarded = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipHash = Buffer.from(forwarded.split(',')[0].trim()).toString('base64').slice(0, 12);

    if (!sessionId) {
      sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      createOrGetSession(sessionId, ipHash, phone);
    } else {
      createOrGetSession(sessionId, ipHash, phone);
    }

    if (!artistId) {
      return NextResponse.json({ success: false, message: 'Please select an artist to vote for.' }, { status: 400 });
    }

    const result = recordFirstVote(sessionId, artistId, ipHash);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    const res = NextResponse.json(result);
    res.cookies.set('gva_session', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
      sameSite: 'lax',
    });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
