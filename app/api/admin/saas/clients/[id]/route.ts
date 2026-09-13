import { type NextRequest, NextResponse } from 'next/server';
import { deleteClient, getClientById, updateClient } from '@/lib/saas-data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const client = await getClientById(id);
    if (!client) {
      return NextResponse.json(
        { error: 'Client tidak ditemukan' },
        { status: 404 },
      );
    }
    return NextResponse.json(client);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data client' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateClient(id, body);
    if (!updated) {
      return NextResponse.json(
        { error: 'Client tidak ditemukan' },
        { status: 404 },
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data client' },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const success = await deleteClient(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Client tidak ditemukan atau gagal dihapus' },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: 'Client berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data client' },
      { status: 500 },
    );
  }
}
