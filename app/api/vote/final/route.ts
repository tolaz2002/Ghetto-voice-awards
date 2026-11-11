import { NextRequest, NextResponse } from 'next/server';
import { recordFinalVotes } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = body.sessionId || req.cookies.get('gva_session')?.value;
    const { artistIds } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Missing session' }, { status: 400 });
    }

    if (!artistIds || !Array.isArray(artistIds) || artistIds.length !== 2) {
      return NextResponse.json({ success: false, message: 'Please select exactly two different artists' }, { status: 400 });
    }

    const forwarded = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const ipHash = Buffer.from(forwarded.split(',')[0].trim()).toString('base64').slice(0, 12);

    const result = recordFinalVotes(sessionId, artistIds, ipHash);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
