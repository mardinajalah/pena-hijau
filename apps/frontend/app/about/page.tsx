import type { Metadata } from 'next';
import AboutPage from '@/components/pages/AboutPage';

export const metadata: Metadata = {
  title: 'Tentang Kami | Pena Hijau',
  description: 'Mengenal gerakan Pena Hijau - Pemuda Nusantara Peduli Lingkungan Hijau melalui edukasi, aksi bersih, dan penanaman pohon.',
};

const About = () => {
  return <AboutPage />;
};

export default About;