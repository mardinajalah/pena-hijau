'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Maximize2, Tag } from 'lucide-react';
import { frontendApi } from '@/lib/api';

export interface GalleryItem {
  id: number;
  title: string;
  category: 'Penghijauan' | 'Aksi Clean-Up' | 'Edukasi' | 'Komunitas';
  location: string;
  date: string;
  banner: string;     // Foto cover untuk kartu
  images: string[];   // Semua foto dalam event ini (untuk lightbox)
  description: string;
}

const fallbackGallery: GalleryItem[] = [
  {
    id: 1,
    title: 'Aksi Bersih Sampah Aliran Sungai Kotaanyar',
    category: 'Aksi Clean-Up',
    location: 'Desa Kotaanyar, Kabupaten Probolinggo',
    date: '27 Juli 2026',
    banner: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
    images: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
    ],
    description: 'Relawan Pena Hijau bergotong-royong membersihkan sampah plastik di aliran sungai Kotaanyar, Kabupaten Probolinggo.',
  },
];

const categories = ['Semua', 'Penghijauan', 'Aksi Clean-Up', 'Edukasi', 'Komunitas'] as const;

const GalleryGrid = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(fallbackGallery);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const [modalEvent, setModalEvent] = useState<GalleryItem | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

  useEffect(() => {
    async function loadGalleries() {
      try {
        const res = await frontendApi.getGalleries();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: GalleryItem[] = res.data.map((g: any) => ({
            id: g.id,
            title: g.title,
            category: g.category || 'Aksi Clean-Up',
            location: g.location,
            date: g.date,
            banner: g.coverImage || g.photos?.[0]?.url || '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
            images: g.photos?.map((p: any) => p.url) || [g.coverImage],
            description: g.description,
          }));
          setGalleryItems(mapped);
        }
      } catch (err) {
        // Fallback
      }
    }
    loadGalleries();
  }, []);

  const filteredItems = selectedCategory === 'Semua'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  const handleOpenModal = (item: GalleryItem) => {
    setModalEvent(item);
    setModalPhotoIndex(0);
  };

  const handleCloseModal = () => {
    setModalEvent(null);
    setModalPhotoIndex(0);
  };

  const handlePrevPhoto = () => {
    if (!modalEvent) return;
    setModalPhotoIndex((prev) => (prev === 0 ? modalEvent.images.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    if (!modalEvent) return;
    setModalPhotoIndex((prev) => (prev === modalEvent.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className='bg-slate-50 py-20 sm:py-28'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        {/* Category Filter Pills */}
        <div className='flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Event Cards Grid */}
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className='group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-900/10 cursor-pointer border border-slate-100'
            >
              <div className='relative h-64 w-full overflow-hidden bg-slate-100'>
                <Image
                  src={item.banner}
                  alt={item.title}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40' />

                <div className='absolute top-4 left-4'>
                  <span className='rounded-full bg-emerald-950/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur border border-white/20'>
                    {item.category}
                  </span>
                </div>

                <div className='absolute bottom-4 right-4'>
                  <span className='inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur'>
                    <Maximize2 className='h-3.5 w-3.5 text-green-400' />
                    {item.images.length} Foto
                  </span>
                </div>
              </div>

              <div className='flex flex-1 flex-col p-6 sm:p-7'>
                <h3 className='text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors line-clamp-2'>
                  {item.title}
                </h3>
                <p className='mt-2.5 text-sm leading-6 text-slate-600 line-clamp-2'>
                  {item.description}
                </p>

                <div className='mt-auto pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-500'>
                  <div className='flex items-center gap-1.5 text-green-700 font-semibold'>
                    <MapPin className='h-3.5 w-3.5 shrink-0' />
                    <span className='truncate max-w-[160px]'>{item.location}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5 shrink-0 text-slate-400' />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {modalEvent && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-6 backdrop-blur-md transition-opacity duration-300'
          onClick={handleCloseModal}
        >
          <div
            className='relative flex max-h-[92vh] max-w-5xl w-full flex-col overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between border-b border-slate-800 px-6 py-4'>
              <div className='min-w-0 pr-4'>
                <div className='flex items-center gap-2'>
                  <span className='rounded-full bg-green-500/20 px-3 py-0.5 text-[11px] font-bold text-green-300 border border-green-500/30'>
                    {modalEvent.category}
                  </span>
                  <span className='text-xs text-slate-400 font-medium'>
                    Foto {modalPhotoIndex + 1} dari {modalEvent.images.length}
                  </span>
                </div>
                <h3 className='mt-1 text-base sm:text-lg font-bold text-white truncate'>
                  {modalEvent.title}
                </h3>
              </div>

              <button
                type='button'
                onClick={handleCloseModal}
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='relative flex flex-1 items-center justify-center bg-black/60 min-h-[320px] sm:min-h-[480px]'>
              <div className='relative h-full w-full p-4 flex items-center justify-center'>
                <div className='relative h-[50vh] sm:h-[65vh] w-full'>
                  <Image
                    src={modalEvent.images[modalPhotoIndex]}
                    alt={`${modalEvent.title} - Foto ${modalPhotoIndex + 1}`}
                    fill
                    sizes='1000px'
                    className='object-contain'
                    priority
                  />
                </div>
              </div>

              {modalEvent.images.length > 1 && (
                <>
                  <button
                    type='button'
                    onClick={handlePrevPhoto}
                    className='absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 hover:scale-110 cursor-pointer shadow-lg'
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </button>
                  <button
                    type='button'
                    onClick={handleNextPhoto}
                    className='absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 hover:scale-110 cursor-pointer shadow-lg'
                  >
                    <ChevronRight className='h-6 w-6' />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {modalEvent.images.length > 1 && (
              <div className='flex items-center gap-2 overflow-x-auto border-t border-slate-800 p-4 scrollbar-thin bg-slate-950/40'>
                {modalEvent.images.map((img, idx) => (
                  <button
                    key={img}
                    type='button'
                    onClick={() => setModalPhotoIndex(idx)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      idx === modalPhotoIndex
                        ? 'border-green-500 scale-105 shadow-md shadow-green-500/20'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx + 1}`} fill sizes='96px' className='object-cover' />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryGrid;
