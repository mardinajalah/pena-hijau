import Link from 'next/link';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import { ChevronRight, Camera, Image as ImageIcon, MapPin, Users } from 'lucide-react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
});

const GalleryHero = () => {
  return (
    <section className='relative flex min-h-svh w-full items-center justify-center overflow-hidden pt-32 sm:pt-36 lg:pt-40 pb-20 sm:pb-24'>
      <Image
        src='/gallery/foto4.webp'
        alt='Galeri Kegiatan Pena Hijau'
        fill
        className='object-cover object-center scale-105'
        priority
      />

      <div className='absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-slate-950/80' />
      <div className='absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30' />

      <div className='relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center sm:text-left z-10'>
        {/* Breadcrumb */}
        <nav className='mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-emerald-100 backdrop-blur-md border border-white/15'>
          <Link href='/' className='transition-colors hover:text-white'>Beranda</Link>
          <ChevronRight className='h-3.5 w-3.5 text-emerald-300' />
          <span className='text-emerald-300 font-semibold'>Galeri Kegiatan</span>
        </nav>

        <div className='max-w-3xl'>
          <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-green-300 border border-green-400/30 backdrop-blur'>
            <Camera className='h-4 w-4' />
            Dokumentasi Aksi Lapangan
          </div>

          <h1
            className={`${montserrat.className} text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-tight text-white`}
            style={{
              textShadow: '0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            Jejak Langkah & Aksi Nyata Pena Hijau
          </h1>

          <p className='mt-6 max-w-2xl text-base sm:text-lg leading-8 text-emerald-100/90'>
            Kumpulan potret semangat relawan, aksi pembersihan lingkungan, workshop edukasi, dan penanaman pohon di berbagai desa dan daerah Nusantara.
          </p>

          {/* Quick Metrics Badges */}
          <div className='mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-white/15 text-xs sm:text-sm font-semibold text-emerald-200'>
            <div className='flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur border border-white/10'>
              <ImageIcon className='h-4 w-4 text-green-400' />
              <span>100+ Foto Dokumentasi</span>
            </div>
            <div className='flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur border border-white/10'>
              <MapPin className='h-4 w-4 text-emerald-400' />
              <span>25+ Desa Mitra</span>
            </div>
            <div className='flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur border border-white/10'>
              <Users className='h-4 w-4 text-teal-400' />
              <span>1.200+ Relawan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalleryHero;
