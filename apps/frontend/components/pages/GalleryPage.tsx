import GalleryHero from '../layouts/gallery/GalleryHero';
import GalleryGrid from '../layouts/gallery/GalleryGrid';
import GalleryCta from '../layouts/gallery/GalleryCta';

const GalleryPage = () => {
  return (
    <div className='w-full overflow-hidden bg-slate-50'>
      {/* 1. Hero Section Galeri */}
      <GalleryHero />

      {/* 2. Grid Galeri Interaktif + Filter + Lightbox Modal */}
      <GalleryGrid />

      {/* 3. Call To Action Penutup */}
      <GalleryCta />
    </div>
  );
};

export default GalleryPage;
