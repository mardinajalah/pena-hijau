import type { Metadata } from 'next';
import GalleryPage from '@/components/pages/GalleryPage';

export const metadata: Metadata = {
  title: 'Manajemen Galeri | Dashboard Pena Hijau',
  description: 'Kelola foto dan dokumentasi event kegiatan aksi lingkungan komunitas Pena Hijau.',
};

const Gallery = () => {
  return <GalleryPage />;
};

export default Gallery;
