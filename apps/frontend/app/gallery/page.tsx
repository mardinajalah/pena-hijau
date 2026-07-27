import type { Metadata } from 'next';
import GalleryPage from '@/components/pages/GalleryPage';

export const metadata: Metadata = {
  title: 'Galeri Kegiatan | Pena Hijau',
  description: 'Dokumentasi foto dan aksi nyata relawan Pena Hijau dalam pembersihan pantai, reforestasi bibit pohon, dan edukasi lingkungan desa.',
};

const Gallery = () => {
  return <GalleryPage />;
};

export default Gallery;
