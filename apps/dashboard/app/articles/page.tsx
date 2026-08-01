import type { Metadata } from 'next';
import ArticlesPage from '@/components/pages/ArticlesPage';

export const metadata: Metadata = {
  title: 'Artikel & Pilar Aksi | Dashboard Pena Hijau',
  description: 'Kelola artikel berita, laporan aksi lapangan, dan konten pilar gerakan komunitas Pena Hijau.',
};

const Articles = () => {
  return <ArticlesPage />;
};

export default Articles;
