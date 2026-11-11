import { NextResponse } from 'next/server';
import { getNominees, getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const nominees = getNominees();
  const settings = getSettings();
  return NextResponse.json(
    {
      nominees,
      settings: {
        votingOpen: settings.votingOpen,
        showLiveResults: settings.showLiveResults,
        ceremonyDate: settings.ceremonyDate,
        categoryName: settings.categoryName,
        editionYear: settings.editionYear,
        announcement: settings.announcement,
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
