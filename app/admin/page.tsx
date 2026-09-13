import type { Metadata } from 'next';
import { AdminLayout } from '@/components/admin/templates/AdminLayout';
import './admin.css';

export const metadata: Metadata = {
  title: 'Central Multi-Tenant SaaS Command | Wedding Platform',
  description:
    'Satu admin panel pusat untuk mengelola seluruh client, undangan, template, dan konten dinamis SaaS Wedding.',
};

export default function AdminPage() {
  return <AdminLayout />;
}
