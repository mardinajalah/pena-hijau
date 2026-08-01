import type { Metadata } from 'next';
import JoinPage from '@/components/pages/JoinPage';

export const metadata: Metadata = {
  title: 'Gabung Relawan | Pena Hijau',
  description: 'Daftarkan diri Anda menjadi relawan muda Pena Hijau Pemuda Nusantara Peduli Lingkungan. Isi nama, domisili alamat, dan motto inspiratif Anda.',
};

const Join = () => {
  return <JoinPage />;
};

export default Join;
