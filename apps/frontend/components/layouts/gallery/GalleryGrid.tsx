'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Maximize2, Tag } from 'lucide-react';

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

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: 'Aksi Bersih Sampah Aliran Sungai',
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
    description: 'Relawan Pena Hijau bersama warga bergotong-royong membersihkan sampah plastik di aliran sungai Kotaanyar, Kabupaten Probolinggo.',
  },
  // Tambahkan event berikutnya di sini ↓
];

const categories = ['Semua', 'Penghijauan', 'Aksi Clean-Up', 'Edukasi', 'Komunitas'] as const;

const GalleryGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Modal state: event index + foto index di dalam event tersebut
  const [modalEvent, setModalEvent] = useState<GalleryItem | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);

  const filteredItems = selectedCategory === 'Semua'
    ? galleryData
    : galleryData.filter((item) => item.category === selectedCategory);

  const handleOpenModal = (item: GalleryItem) => {
    setModalEvent(item);
    setModalPhotoIndex(0); // selalu mulai dari foto pertama
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
        {/* Category Filter Tabs */}
        <div className='flex flex-wrap items-center justify-center gap-3 mb-14'>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type='button'
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 scale-105'
                    : 'bg-white text-slate-700 hover:bg-green-50 hover:text-green-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Gallery Image Grid */}
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredItems.map((item) => (
            <article
              key={item.id}
              onClick={() => handleOpenModal(item)}
              className='group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-950/10 cursor-pointer'
            >
              {/* Image Container — pakai banner (foto cover) */}
              <div className='relative h-72 w-full overflow-hidden bg-slate-100'>
                <Image
                  src={item.banner}
                  alt={item.title}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80' />

                {/* Top Badges */}
                <div className='absolute top-4 left-4 right-4 flex items-center justify-between z-10'>
                  <span className='rounded-full bg-emerald-950/80 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur border border-white/20'>
                    {item.category}
                  </span>
                  <div className='flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur transition-transform group-hover:scale-105'>
                    <Maximize2 className='h-3.5 w-3.5' />
                    {item.images.length} Foto
                  </div>
                </div>

                {/* Bottom Overlay */}
                <div className='absolute bottom-4 left-4 right-4 text-white z-10'>
                  <div className='flex items-center gap-1.5 text-xs text-emerald-300 font-medium'>
                    <MapPin className='h-3.5 w-3.5' />
                    <span className='truncate'>{item.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className='flex flex-1 flex-col p-6 sm:p-7'>
                <h3 className='text-lg font-bold text-slate-900 group-hover:text-green-600 transition-colors line-clamp-2'>
                  {item.title}
                </h3>
                <p className='mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed'>
                  {item.description}
                </p>

                <div className='mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium'>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5 text-green-600' />
                    {item.date}
                  </span>
                  <span className='text-green-600 font-semibold group-hover:underline'>
                    Lihat Foto
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── Lightbox Modal ── */}
      {/* Navigasi ◀ ▶ berganti foto dalam event yang sama, bukan berpindah event */}
      {modalEvent && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-8 backdrop-blur-md'
          onClick={handleCloseModal}
        >
          <div
            className='relative max-w-4xl w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl text-white'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type='button'
              onClick={handleCloseModal}
              className='absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-white transition-colors hover:bg-green-600 cursor-pointer border border-white/10'
              aria-label='Tutup modal'
            >
              <X className='h-6 w-6' />
            </button>

            {/* Counter foto */}
            <div className='absolute top-4 left-4 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur'>
              {modalPhotoIndex + 1} / {modalEvent.images.length}
            </div>

            {/* Main Modal Image — foto aktif dari images[] */}
            <div className='relative h-80 sm:h-112.5 w-full overflow-hidden bg-slate-950'>
              <Image
                key={modalEvent.images[modalPhotoIndex]}
                src={modalEvent.images[modalPhotoIndex]}
                alt={`${modalEvent.title} - Foto ${modalPhotoIndex + 1}`}
                fill
                sizes='(max-width: 1200px) 100vw, 1200px'
                className='object-contain'
                priority
              />

              {/* Prev / Next navigasi foto dalam event */}
              {modalEvent.images.length > 1 && (
                <>
                  <button
                    type='button'
                    onClick={handlePrevPhoto}
                    className='absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 cursor-pointer border border-white/10'
                    aria-label='Foto sebelumnya'
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </button>

                  <button
                    type='button'
                    onClick={handleNextPhoto}
                    className='absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 cursor-pointer border border-white/10'
                    aria-label='Foto berikutnya'
                  >
                    <ChevronRight className='h-6 w-6' />
                  </button>

                  {/* Dot indicator */}
                  <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5'>
                    {modalEvent.images.map((_, i) => (
                      <button
                        key={i}
                        type='button'
                        onClick={() => setModalPhotoIndex(i)}
                        aria-label={`Foto ${i + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          i === modalPhotoIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Info */}
            <div className='p-6 sm:p-8 bg-slate-900'>
              <div className='flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-400'>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 border border-green-500/30'>
                  <Tag className='h-3.5 w-3.5' />
                  {modalEvent.category}
                </span>
                <span className='flex items-center gap-1 text-slate-300'>
                  <MapPin className='h-4 w-4 text-green-400' />
                  {modalEvent.location}
                </span>
                <span className='flex items-center gap-1 text-slate-400'>
                  <Calendar className='h-4 w-4 text-emerald-400' />
                  {modalEvent.date}
                </span>
              </div>

              <h3 className='mt-3 text-xl sm:text-2xl font-bold text-white'>
                {modalEvent.title}
              </h3>

              <p className='mt-3 text-sm sm:text-base leading-relaxed text-slate-300'>
                {modalEvent.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryGrid;
