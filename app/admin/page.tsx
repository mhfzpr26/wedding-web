import type { Metadata } from 'next';
import { AdminClientWrapper } from '@/components/admin/templates/AdminClientWrapper';
import './admin.css';

export const metadata: Metadata = {
  title: 'WEDFLOW — SaaS Command Center',
  description:
    'Central multi-tenant admin panel untuk mengelola seluruh client, undangan, template, dan konten SaaS Wedding.',
};

export default function AdminPage() {
  return <AdminClientWrapper />;
}
