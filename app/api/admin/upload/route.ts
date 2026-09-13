import fs from 'node:fs';
import path from 'node:path';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'File wajib diunggah' },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name || 'upload';
    const ext = path.extname(originalName).toLowerCase() || '.bin';
    const base = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${Date.now()}_${base}${ext}`;

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
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Gagal mengunggah file ke server' },
      { status: 500 },
    );
  }
}
