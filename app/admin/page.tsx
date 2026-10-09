import type { Metadata } from 'next';
import { AdminClientWrapper } from '@/components/admin/templates/AdminClientWrapper';
import './admin.css';

export const metadata: Metadata = {
  title: 'INVATERA — SaaS Studio & Command Center',
  description:
    'Central multi-tenant admin panel untuk mengelola seluruh client, undangan, template, dan konten SaaS Invatera Digital Invitations.',
};

export default function AdminPage() {
  return <AdminClientWrapper />;
}
