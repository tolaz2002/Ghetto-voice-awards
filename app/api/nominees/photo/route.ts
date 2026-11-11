import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { updateNomineeData, getNominees } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let nomineeId = '';
    let imageBuffer: Buffer | null = null;
    let extension = 'jpg';
    let isReset = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      nomineeId = (formData.get('nomineeId') as string) || '';
      const file = formData.get('file') as File | null;
      const reset = formData.get('reset') as string | null;

      if (reset === 'true') {
        isReset = true;
      } else if (file) {
        const bytes = await file.arrayBuffer();
        imageBuffer = Buffer.from(bytes);
        const name = file.name || 'image.jpg';
        const ext = path.extname(name).replace('.', '').toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
          extension = ext === 'jpeg' ? 'jpg' : ext;
        }
      }
    } else {
      const body = await req.json();
      nomineeId = body.nomineeId;
      isReset = body.reset === true;

      if (body.imageBase64) {
        // Strip data:image/...;base64, prefix if present
        const matches = body.imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
        if (matches) {
          const format = matches[1].toLowerCase();
          extension = format === 'jpeg' ? 'jpg' : format;
          imageBuffer = Buffer.from(matches[2], 'base64');
        } else {
          imageBuffer = Buffer.from(body.imageBase64, 'base64');
        }
      }
    }

    if (!nomineeId) {
      return NextResponse.json({ success: false, message: 'Missing nomineeId' }, { status: 400 });
    }

    const nominees = getNominees();
    const nominee = nominees.find((n) => n.id === nomineeId);
    if (!nominee) {
      return NextResponse.json({ success: false, message: 'Nominee not found' }, { status: 404 });
    }

    if (isReset) {
      const defaultPath = `/images/${nomineeId}.jpg`;
      updateNomineeData(nomineeId, { image: defaultPath });
      return NextResponse.json({ success: true, image: defaultPath, message: 'Reset to official portrait.' });
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid image data provided' }, { status: 400 });
    }

    // Save image to public/images/
    const publicDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `custom-${nomineeId}-${timestamp}.${extension}`;
    const filePath = path.join(publicDir, filename);

    fs.writeFileSync(filePath, imageBuffer);

    const publicUrl = `/images/${filename}`;
    updateNomineeData(nomineeId, { image: publicUrl });

    return NextResponse.json({
      success: true,
      image: publicUrl,
      message: `Successfully replaced photo for ${nominee.name}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
