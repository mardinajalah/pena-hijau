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
  image: string;
  description: string;
}

const galleryData: GalleryItem[] = [
  {
    id: 1,
    title: 'Aksi Bersih Sampah Pesisir Pantai',
    category: 'Aksi Clean-Up',
    location: 'Desa Pesisir Hijau, Subang',
    date: '14 Februari 2026',
    image: '/gallery/foto1.webp',
    description: 'Relawan Pena Hijau bersama warga pesisir bergotong-royong membersihkan sampah plastik di sepanjang garis pantai.',
  },
  {
    id: 2,
    title: 'Penanaman 500 Pohon Produktif',
    category: 'Penghijauan',
    location: 'Desa Lestari, Garut',
    date: '28 Januari 2026',
    image: '/gallery/foto2.webp',
    description: 'Program reforestasi lahan kritis desa dengan menanam bibit alpukat dan durian untuk menambah pendapatan warga.',
  },
  {
    id: 3,
    title: 'Penghijauan Bantaran Sungai & Mangrove',
    category: 'Penghijauan',
    location: 'Desa Sukamaju, Karawang',
    date: '10 Januari 2026',
    image: '/gallery/foto3.webp',
    description: 'Aksi perlindungan erosi bantaran sungai menggunakan bibit mangrove dan vegetasi lokal pendukung ekosistem air.',
  },
  {
    id: 4,
    title: 'Kampanye & Pemilahan Sampah Organik',
    category: 'Edukasi',
    location: 'Desa Cinta Alam, Bandung',
    date: '20 Desember 2025',
    image: '/gallery/foto4.webp',
    description: 'Sosialisasi pengolahan sisa makanan menjadi pupuk kompost cair secara mandiri di rumah tangga.',
  },
  {
    id: 5,
    title: 'Aksi Pemuda Peduli Lingkungan Desa',
    category: 'Komunitas',
    location: 'Desa Harapan Baru, Sumedang',
    date: '05 Desember 2025',
    image: '/gallery/foto5.webp',
    description: 'Pembentukan karang taruna peduli sampah dan peresmian Bank Sampah Pemuda Harapan.',
  },
  {
    id: 6,
    title: 'Workshop Daur Ulang Kreatif Sekolah',
    category: 'Edukasi',
    location: 'Desa Bumi Asri, Bogor',
    date: '18 November 2025',
    image: '/gallery/foto6.webp',
    description: 'Mengajar para siswa sekolah dasar mengolah limbah plastik menjadi pot tanaman hias kreatif.',
  },
  {
    id: 7,
    title: 'Penanaman Mangrove Pesisir Utara',
    category: 'Penghijauan',
    location: 'Desa Tunas Hijau, Indramayu',
    date: '02 November 2025',
    image: '/gallery/foto7.webp',
    description: 'Konservasi wilayah pesisir dari abrasi laut melalui penanaman bibit mangrove jenis Rhizophora.',
  },
  {
    id: 8,
    title: 'Pendampingan Desa Mandiri Pengelolaan Sampah',
    category: 'Komunitas',
    location: 'Desa Sejahtera, Sukabumi',
    date: '15 Oktober 2025',
    image: '/gallery/foto8.webp',
    description: 'Pendampingan langsung pembuatan tempat pembuangan akhir berbahan organik dan sosialisasi pemilahan.',
  },
  {
    id: 9,
    title: 'Aksi Bersih Lingkungan Pemukiman Warga',
    category: 'Aksi Clean-Up',
    location: 'Desa Mekar Sari, Majalengka',
    date: '25 September 2025',
    image: '/gallery/foto9.webp',
    description: 'Aksi rutin mingguan pembersihan selokan dan saluran air warga menjelang musim penghujan.',
  },
  {
    id: 10,
    title: 'Konservasi Ekosistem Mangrove Nusantara',
    category: 'Penghijauan',
    location: 'Kawasan Konservasi Hutan Mangrove',
    date: '12 September 2025',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
    description: 'Edukasi lapangan pentingnya ekosistem mangrove sebagai penyerap karbon alami dan benteng abrasi.',
  },
  {
    id: 11,
    title: 'Aksi Tanam Pohon Penghijauan Bukit',
    category: 'Penghijauan',
    location: 'Bukit Hijau Nusantara',
    date: '01 Agustus 2025',
    image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=1200&auto=format&fit=crop',
    description: 'Gerakan penanaman bibit pohon lindung di area lereng bukit rawan tanah longsor.',
  },
  {
    id: 12,
    title: 'Aksi Bersih Plastik Laut & Muara',
    category: 'Aksi Clean-Up',
    location: 'Muara Sungai Pesisir',
    date: '18 Juli 2025',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1200&auto=format&fit=crop',
    description: 'Pengumpulan dan pemilahan limbah plastik laut hasil penyaringan muara sungai bersama relawan.',
  },
  {
    id: 13,
    title: 'Taman Edukasi Pertanian Organik',
    category: 'Edukasi',
    location: 'Komunitas Tani Hijau',
    date: '05 Juni 2025',
    image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1200&auto=format&fit=crop',
    description: 'Pelatihan teknik berkebun ramah lingkungan tanpa pestisida kimia untuk ketahanan pangan keluarga.',
  },
  {
    id: 14,
    title: 'Pelatihan Bank Sampah Mandiri',
    category: 'Edukasi',
    location: 'Desa Binaan Pena Hijau',
    date: '20 Mei 2025',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop',
    description: 'Workshop manajerial dan sistem penimbangan Bank Sampah untuk mendukung ekonomi sirkular warga.',
  },
  {
    id: 15,
    title: 'Pembibitan Tanaman Pelindung',
    category: 'Penghijauan',
    location: 'Nursery Pemuda Hijau',
    date: '08 April 2025',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop',
    description: 'Pusat perawatan dan perawatan bibit unggul sebelum didistribusikan ke program tanam gratis.',
  },
  {
    id: 16,
    title: 'Temu Forum Relawan Lingkungan Muda',
    category: 'Komunitas',
    location: 'Gedung Pemuda Hijau',
    date: '15 Maret 2025',
    image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=1200&auto=format&fit=crop',
    description: 'Rapat koordinasi tahunan penyusunan kalender aksi hijau di seluruh wilayah mitra Pena Hijau.',
  },
];

const categories = ['Semua', 'Penghijauan', 'Aksi Clean-Up', 'Edukasi', 'Komunitas'] as const;

const GalleryGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const filteredItems = selectedCategory === 'Semua'
    ? galleryData
    : galleryData.filter((item) => item.category === selectedCategory);

  const handleOpenModal = (index: number) => {
    setActiveModalIndex(index);
  };

  const handleCloseModal = () => {
    setActiveModalIndex(null);
  };

  const handlePrevItem = () => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) => (prev! === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const handleNextItem = () => {
    if (activeModalIndex === null) return;
    setActiveModalIndex((prev) => (prev! === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  const currentItem = activeModalIndex !== null ? filteredItems[activeModalIndex] : null;

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
          {filteredItems.map((item, index) => (
            <article
              key={item.id}
              onClick={() => handleOpenModal(index)}
              className='group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-950/10 cursor-pointer'
            >
              {/* Image Container */}
              <div className='relative h-72 w-full overflow-hidden bg-slate-100'>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80' />

                {/* Top Badges */}
                <div className='absolute top-4 left-4 right-4 flex items-center justify-between z-10'>
                  <span className='rounded-full bg-emerald-950/80 px-3.5 py-1 text-xs font-semibold text-emerald-200 backdrop-blur border border-white/20'>
                    {item.category}
                  </span>
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-transform group-hover:scale-110'>
                    <Maximize2 className='h-4 w-4' />
                  </div>
                </div>

                {/* Bottom Overlay Text inside image */}
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

      {/* Lightbox Modal */}
      {currentItem && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-8 backdrop-blur-md transition-opacity duration-300'
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

            {/* Main Modal Image */}
            <div className='relative h-80 sm:h-[450px] w-full overflow-hidden bg-slate-950'>
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                fill
                sizes='(max-width: 1200px) 100vw, 1200px'
                className='object-contain'
                priority
              />

              {/* Prev / Next Modal Buttons */}
              <button
                type='button'
                onClick={handlePrevItem}
                className='absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 cursor-pointer border border-white/10'
                aria-label='Foto sebelumnya'
              >
                <ChevronLeft className='h-6 w-6' />
              </button>

              <button
                type='button'
                onClick={handleNextItem}
                className='absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 cursor-pointer border border-white/10'
                aria-label='Foto berikutnya'
              >
                <ChevronRight className='h-6 w-6' />
              </button>
            </div>

            {/* Modal Info Details */}
            <div className='p-6 sm:p-8 bg-slate-900'>
              <div className='flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-emerald-400'>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 border border-green-500/30'>
                  <Tag className='h-3.5 w-3.5' />
                  {currentItem.category}
                </span>
                <span className='flex items-center gap-1 text-slate-300'>
                  <MapPin className='h-4 w-4 text-green-400' />
                  {currentItem.location}
                </span>
                <span className='flex items-center gap-1 text-slate-400'>
                  <Calendar className='h-4 w-4 text-emerald-400' />
                  {currentItem.date}
                </span>
              </div>

              <h3 className='mt-3 text-xl sm:text-2xl font-bold text-white'>
                {currentItem.title}
              </h3>

              <p className='mt-3 text-sm sm:text-base leading-relaxed text-slate-300'>
                {currentItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GalleryGrid;
