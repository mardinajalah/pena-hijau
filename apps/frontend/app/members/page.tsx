import type { Metadata } from 'next';
import MemberPage from '@/components/pages/MemberPage';

export const metadata: Metadata = {
  title: 'Anggota & Relawan | Pena Hijau',
  description: 'Mengenal tim penggerak, pengurus inti, koordinator lapangan, dan relawan muda Pena Hijau Pemuda Nusantara Peduli Lingkungan.',
};

const Members = () => {
  return <MemberPage />;
};

export default Members;
