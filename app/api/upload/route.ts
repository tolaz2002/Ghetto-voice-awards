import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { updateNomineeData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload with base64
    if (contentType.includes('application/json')) {
      const { nomineeId, base64Data, filename } = await req.json();

      if (!nomineeId || !base64Data) {
        return NextResponse.json({ success: false, message: 'Missing nomineeId or base64Data' }, { status: 400 });
      }

      // Clean base64 data
      const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Clean, 'base64');

      const targetFileName = `${nomineeId}.jpg`;
      const publicPath = path.join(process.cwd(), 'public', 'images', targetFileName);

      fs.writeFileSync(publicPath, buffer);

      const imagePath = `/images/${targetFileName}?v=${Date.now()}`;
      updateNomineeData(nomineeId, { image: imagePath });

      return NextResponse.json({ success: true, imagePath });
    }

    // Handle FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const nomineeId = formData.get('nomineeId') as string | null;

      if (!file || !nomineeId) {
        return NextResponse.json({ success: false, message: 'Missing file or nomineeId' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const targetFileName = `${nomineeId}.jpg`;
      const publicPath = path.join(process.cwd(), 'public', 'images', targetFileName);

      fs.writeFileSync(publicPath, buffer);

      const imagePath = `/images/${targetFileName}?v=${Date.now()}`;
      updateNomineeData(nomineeId, { image: imagePath });

      return NextResponse.json({ success: true, imagePath });
    }

    return NextResponse.json({ success: false, message: 'Unsupported content type' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
