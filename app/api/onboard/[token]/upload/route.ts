import fs from 'node:fs';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ token: string }>;
}

export async function POST(request: NextRequest, _context: RouteContext) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File wajib disertakan' },
        { status: 400 },
      );
    }

    // Limit size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file maksimal 10MB' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || 'photo.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const base = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `onboard_${Date.now()}_${base}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destination = path.join(uploadsDir, filename);
    fs.writeFileSync(destination, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      message: 'File berhasil diunggah',
      url: publicUrl,
      filename,
      size: file.size,
    });
  } catch (error) {
    console.error('Error handling onboard file upload:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah file ke server' },
      { status: 500 },
    );
  }
}
