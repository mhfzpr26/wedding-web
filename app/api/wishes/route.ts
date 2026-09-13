import fs from 'node:fs';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'node:path';
import type { WishPayload, WishRecord } from '@/types/wishes';

const dataFilePath = path.join(process.cwd(), 'data', 'wishes.json');

function getWishes(): WishRecord[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading wishes:', error);
    return [];
  }
}

function saveWishes(wishes: WishRecord[]): void {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving wishes:', error);
  }
}

export async function GET() {
  const wishes = getWishes();
  return NextResponse.json(wishes);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WishPayload;
    const { name, status, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Nama dan pesan wajib diisi' },
        { status: 400 },
      );
    }

    const currentWishes = getWishes();
    const newWish: WishRecord = {
      id: Date.now().toString(),
      name: name.trim(),
      status: status || 'Hadir',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedWishes = [newWish, ...currentWishes];
    saveWishes(updatedWishes);

    return NextResponse.json(newWish, { status: 201 });
  } catch (error) {
    console.error('Error processing wish POST:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat menyimpan ucapan' },
      { status: 500 },
    );
  }
}
