import type { Metadata } from 'next';
import MembersPage from '@/components/pages/MembersPage';

export const metadata: Metadata = {
  title: 'Anggota Relawan | Dashboard Pena Hijau',
  description: 'Kelola data seluruh anggota relawan komunitas Pena Hijau di berbagai desa mitra.',
};

const Members = () => {
  return <MembersPage />;
};

export default Members;
