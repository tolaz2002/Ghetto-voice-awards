import { NextResponse } from 'next/server';
import { getStats } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = getStats();
  if (!stats.settings.showLiveResults) {
    return NextResponse.json(
      {
        hidden: true,
        message: 'Voting results are currently sealed by the Awards Committee until the Grand Ceremony.',
        settings: stats.settings,
      },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  return NextResponse.json(
    {
      hidden: false,
      rankings: stats.rankings,
      totalVotes: stats.totalVotes,
      totalSessions: stats.totalSessions,
      completedSessions: stats.completedSessions,
      totalShares: stats.totalShares,
      settings: {
        votingOpen: stats.settings.votingOpen,
        ceremonyDate: stats.settings.ceremonyDate,
        categoryName: stats.settings.categoryName,
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
