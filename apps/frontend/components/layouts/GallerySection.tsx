'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MoveUpRight, Images } from 'lucide-react';
import { frontendApi } from '@/lib/api';

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const getBackendHost = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pena-hijau-backend.vercel.app/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
};

const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') {
    return '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp';
  }
  if (url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return `${getBackendHost()}${url}`;
  }
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp';
};

const GallerySection = () => {
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next');

  useEffect(() => {
    async function loadGalleries() {
      try {
        setIsLoading(true);
        const res = await frontendApi.getGalleries();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: GalleryItem[] = res.data.map((g: any) => ({
            id: g.id,
            title: g.title,
            description: g.description || (g.location ? `Lokasi: ${g.location}` : ''),
            image: resolveImageUrl(g.coverImage || g.photos?.[0]?.url),
          }));
          setGalleries(mapped);
        } else {
          setGalleries([]);
        }
      } catch (err) {
        setGalleries([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadGalleries();
  }, []);

  const hasData = galleries.length > 0;
  const activeGallery = hasData ? galleries[activeIndex % galleries.length] : null;
  const visibleCount = hasData ? Math.min(galleries.length, 3) : 0;
  const visibleGalleries = hasData
    ? Array.from({ length: visibleCount }, (_, offset) => {
        const galleryIndex = (activeIndex + offset) % galleries.length;

        return {
          ...galleries[galleryIndex],
          galleryIndex,
          slot: offset,
        };
      })
    : [];

  const handlePrevious = () => {
    if (!hasData) return;
    setSlideDirection('previous');
    setActiveIndex((currentIndex) => (currentIndex === 0 ? galleries.length - 1 : currentIndex - 1));
  };

  const handleNext = () => {
    if (!hasData) return;
    setSlideDirection('next');
    setActiveIndex((currentIndex) => (currentIndex === galleries.length - 1 ? 0 : currentIndex + 1));
  };

  const handleSelectGallery = (galleryIndex: number) => {
    if (!hasData) return;
    setSlideDirection(galleryIndex > activeIndex ? 'next' : 'previous');
    setActiveIndex(galleryIndex);
  };

  return (
    <section className='overflow-hidden bg-slate-50 py-20 sm:py-24'>
      <div className='mx-auto max-w-8xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-14 max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Galeri Kegiatan</p>
          <h2 className='mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Jejak Aksi Pena Hijau di Berbagai Tempat</h2>
          <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>
            Galeri ini menampilkan perjalanan dan kontribusi Pena Hijau dalam mendukung pelestarian lingkungan, mulai dari membersihkan sampah, penanaman pohon hingga kegiatan edukasi secara aktif.
          </p>
        </div>

        {isLoading ? (
          <div className='flex justify-center py-16 items-center'>
            <div className='text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
              <p className='mt-4 text-sm font-semibold text-slate-500'>Memuat data galeri...</p>
            </div>
          </div>
        ) : !hasData || !activeGallery ? (
          <div className='text-center py-16 rounded-3xl bg-white border border-slate-200/80 max-w-md mx-auto shadow-sm'>
            <Images className='mx-auto h-10 w-10 text-slate-300 mb-3' />
            <p className='text-slate-500 font-medium text-sm'>
              Belum ada foto galeri kegiatan yang diunggah.
            </p>
          </div>
        ) : (
          <div className='grid min-w-0 items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-0'>
            <div className='relative z-0 h-90 overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10 sm:h-115 lg:h-130 bg-slate-200'>
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
                      key={`slot-${gallery.slot}`}
                      type='button'
                      onClick={() => handleSelectGallery(gallery.galleryIndex)}
                      className={`min-h-75 min-w-full cursor-pointer rounded-3xl p-8 text-left shadow-lg transition-all duration-300 sm:min-w-[calc(50%-10px)] md:min-w-[calc(33.333%-14px)] lg:min-w-75 ${
                        isActive ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-white text-slate-900 shadow-slate-900/5 hover:-translate-y-1'
                      }`}
                    >
                      <h3 className='text-2xl font-bold line-clamp-2'>{gallery.title}</h3>
                      <div className={`mt-7 h-1 w-12 rounded-full ${isActive ? 'bg-white' : 'bg-green-600'}`} />
                      <p className={`mt-8 text-base leading-8 line-clamp-3 ${isActive ? 'text-green-50' : 'text-slate-600'}`}>{gallery.description}</p>
                      <span className='mt-10 block text-3xl'>
                        <MoveUpRight />
                      </span>
                    </button>
                  );
                })}
              </div>

              {galleries.length > 1 && (
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
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;

