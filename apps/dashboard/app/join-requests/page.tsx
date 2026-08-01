import type { Metadata } from 'next';
import JoinRequestsPage from '@/components/pages/JoinRequestsPage';

export const metadata: Metadata = {
  title: 'Permintaan Gabung | Dashboard Pena Hijau',
  description: 'Verifikasi dan kelola formulir pendaftaran pemuda yang ingin bergabung sebagai relawan Pena Hijau.',
};

const JoinRequests = () => {
  return <JoinRequestsPage />;
};

export default JoinRequests;
