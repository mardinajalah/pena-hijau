'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronRight, ChevronLeft, MoveUpRight } from 'lucide-react';

const galleries = [
  {
    title: 'Desa Pesisir Hijau',
    description: 'Jalan Pantai Bersih, kawasan pesisir tempat aksi bersih sampah bersama warga.',
    image: '/gallery/foto1.jpg',
  },
  {
    title: 'Desa Lestari',
    description: 'Jalan Raya Lestari, area edukasi lingkungan dan pengelolaan sampah warga.',
    image: '/gallery/foto2.jpg',
  },
  {
    title: 'Desa Sukamaju',
    description: 'Jalan Sukamaju Indah, lokasi kegiatan penghijauan dan gotong royong pemuda.',
    image: '/gallery/foto3.jpg',
  },
  {
    title: 'Desa Cinta Alam',
    description: 'Jalan Cinta Alam, tempat kampanye peduli lingkungan dan pemilahan sampah.',
    image: '/gallery/foto4.jpg',
  },
  {
    title: 'Desa Harapan Baru',
    description: 'Jalan Harapan Baru, ruang kolaborasi warga untuk menjaga lingkungan sekitar.',
    image: '/gallery/foto5.jpg',
  },
  {
    title: 'Desa Bumi Asri',
    description: 'Jalan Bumi Asri, titik edukasi daur ulang dan pemanfaatan sampah rumah tangga.',
    image: '/gallery/foto6.jpg',
  },
  {
    title: 'Desa Tunas Hijau',
    description: 'Jalan Tunas Hijau, area kegiatan tanam pohon dan perawatan ruang terbuka.',
    image: '/gallery/foto7.jpg',
  },
  {
    title: 'Desa Sejahtera',
    description: 'Jalan Sejahtera, lokasi pendampingan warga untuk lingkungan yang lebih bersih.',
    image: '/gallery/foto8.jpg',
  },
  {
    title: 'Desa Mekar Sari',
    description: 'Jalan Mekar Sari, tempat aksi komunitas dalam menjaga kebersihan desa.',
    image: '/gallery/foto9.jpg',
  },
];

const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');
  const activeGallery = galleries[activeIndex];
  const visibleGalleries = [0, 1, 2].map((offset) => {
    const galleryIndex = (activeIndex + offset) % galleries.length;

    return {
      ...galleries[galleryIndex],
      galleryIndex,
    };
  });

  const handlePrevious = () => {
    setSlideDirection('previous');
    setActiveIndex((currentIndex) => (currentIndex === 0 ? galleries.length - 1 : currentIndex - 1));
  };

  const handleNext = () => {
    setSlideDirection('next');
    setActiveIndex((currentIndex) => (currentIndex === galleries.length - 1 ? 0 : currentIndex + 1));
  };

  const handleSelectGallery = (galleryIndex: number) => {
    setSlideDirection(galleryIndex > activeIndex ? 'next' : 'previous');
    setActiveIndex(galleryIndex);
  };

  return (
    <section className='overflow-hidden bg-slate-50 py-20 sm:py-24'>
      <div className='mx-auto max-w-8xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-14 max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Galeri Kegiatan</p>
          <h2 className='mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Jejak Aksi Pena Hijau di Berbagai Desa</h2>
          <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>
            Galeri ini menampilkan perjalanan dan kontribusi Pena Hijau dalam mendukung pelestarian lingkungan, mulai dari membersihkan sampah, penanaman pohon hingga kegiatan edukasi yang melibatkan masyarakat secara aktif.
          </p>
        </div>

        <div className='grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-0'>
          <div className='relative z-0 h-90 overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10 sm:h-115 lg:h-130'>
            <Image
              src={activeGallery.image}
              alt={activeGallery.title}
              fill
              sizes='(min-width: 1024px) 50vw, 100vw'
              className='object-cover transition-transform duration-500 ease-out'
              priority
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/25 to-transparent' />
          </div>

          <div className='relative z-10 min-w-0 lg:-ml-36'>
            <div
              key={`${activeIndex}-${slideDirection}`}
              className={`flex w-full min-w-0 gap-5 overflow-hidden pb-3 ${slideDirection === 'next' ? 'animate-gallery-slide-next' : 'animate-gallery-slide-previous'}`}
            >
              {visibleGalleries.map((gallery) => {
                const isActive = gallery.galleryIndex === activeIndex;

                return (
                  <button
                    key={gallery.title}
                    type='button'
                    onClick={() => handleSelectGallery(gallery.galleryIndex)}
                    className={`min-h-75 min-w-full cursor-pointer rounded-3xl p-8 text-left shadow-lg transition-all duration-300 sm:min-w-[calc(50%-10px)] md:min-w-[calc(33.333%-14px)] lg:min-w-75 ${
                      isActive ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-white text-slate-900 shadow-slate-900/5 hover:-translate-y-1'
                    }`}
                  >
                    <h3 className='text-2xl font-bold'>{gallery.title}</h3>
                    <div className={`mt-7 h-1 w-12 rounded-full ${isActive ? 'bg-white' : 'bg-green-600'}`} />
                    <p className={`mt-8 text-base leading-8 ${isActive ? 'text-green-50' : 'text-slate-600'}`}>{gallery.description}</p>
                    <span className='mt-10 block text-3xl'>
                      <MoveUpRight />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className='mt-8 flex justify-center gap-3'>
              <button
                type='button'
                onClick={handlePrevious}
                aria-label='Galeri sebelumnya'
                className='flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-2xl text-slate-500 shadow-sm transition-colors hover:text-white hover:bg-green-600 cursor-pointer'
              >
                <ChevronLeft />
              </button>
              <button
                type='button'
                onClick={handleNext}
                aria-label='Galeri berikutnya'
                className='flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-2xl text-slate-500 shadow-sm transition-colors hover:text-white hover:bg-green-600 cursor-pointer'
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
