import { NextRequest, NextResponse } from 'next/server';
import { getStats, getDb, updateSettings, updateNomineeData, resetDemo } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, passcode, settings, nomineeId, nomineeUpdates } = body;

    const db = getDb();
    if (passcode !== db.settings.adminPasscode) {
      return NextResponse.json({ success: false, message: 'Invalid administrator passcode' }, { status: 401 });
    }

    if (action === 'verify') {
      const stats = getStats();
      return NextResponse.json({ success: true, stats });
    }

    if (action === 'updateSettings') {
      if (!settings) {
        return NextResponse.json({ success: false, message: 'Missing settings payload' }, { status: 400 });
      }
      const updated = updateSettings(settings);
      const stats = getStats();
      return NextResponse.json({ success: true, settings: updated, stats });
    }

    if (action === 'updateNominee') {
      if (!nomineeId || !nomineeUpdates) {
        return NextResponse.json({ success: false, message: 'Missing nominee parameters' }, { status: 400 });
      }
      const ok = updateNomineeData(nomineeId, nomineeUpdates);
      const stats = getStats();
      return NextResponse.json({ success: ok, stats });
    }

    if (action === 'resetDemo') {
      resetDemo();
      const stats = getStats();
      return NextResponse.json({ success: true, stats, message: 'System reset to official baseline configuration.' });
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const passcode = req.nextUrl.searchParams.get('passcode');
  const exportCsv = req.nextUrl.searchParams.get('export') === 'csv';

  const db = getDb();
  if (passcode !== db.settings.adminPasscode) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (exportCsv) {
    // Generate CSV of votes
    const header = 'VoteID,SessionID,ArtistID,ArtistName,StageNumber,Timestamp,ClientIPHash\n';
    const rows = db.votes
      .map((v) => `"${v.id}","${v.sessionId}","${v.artistId}","${v.artistName}",${v.stageNumber},"${v.timestamp}","${v.clientIpHash}"`)
      .join('\n');
    const csvContent = header + rows;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="ghetto_voice_awards_votes_${Date.now()}.csv"`,
      },
    });
  }

  const stats = getStats();
  return NextResponse.json({ stats });
}
