'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Images,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface GalleryEvent {
  id: number;
  title: string;
  category: 'Aksi Clean-Up' | 'Penghijauan' | 'Edukasi' | 'Komunitas';
  location: string;
  date: string;
  coverImage: string;
  photos: string[];
  description: string;
}

const initialEvents: GalleryEvent[] = [
  {
    id: 1,
    title: 'Aksi Bersih Sampah Aliran Sungai Kotaanyar',
    category: 'Aksi Clean-Up',
    location: 'Desa Kotaanyar, Probolinggo',
    date: '27 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
    photos: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
    ],
    description: 'Relawan Pena Hijau bersama warga bergotong-royong membersihkan limbah plastik di jembatan sungai Kotaanyar.',
  },
  {
    id: 2,
    title: 'Penanaman 500 Bibit Pohon Produktif',
    category: 'Penghijauan',
    location: 'Kecamatan Paiton, Probolinggo',
    date: '15 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
    photos: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp',
    ],
    description: 'Aksi hijau menanam bibit pohon buah dan lindung di kawasan lereng kritis desa mitra.',
  },
  {
    id: 3,
    title: 'Sosialisasi Pemilahan Sampah Mandiri',
    category: 'Edukasi',
    location: 'Desa Pesisir Hijau, Situbondo',
    date: '02 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp',
    photos: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
    ],
    description: 'Edukasi pengelolaan dan pemilahan sampah anorganik bagi warga dan generasi muda pesisir.',
  },
];

const categories = ['Semua', 'Aksi Clean-Up', 'Penghijauan', 'Edukasi', 'Komunitas'];

const GalleryPage = () => {
  const [events, setEvents] = useState<GalleryEvent[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal States
  const [viewEvent, setViewEvent] = useState<GalleryEvent | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for Add Event (UI Preview)
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Aksi Clean-Up' | 'Penghijauan' | 'Edukasi' | 'Komunitas'>('Aksi Clean-Up');
  const [formLocation, setFormLocation] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Filter Logic
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || ev.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenPhotoViewer = (ev: GalleryEvent) => {
    setViewEvent(ev);
    setActivePhotoIdx(0);
  };

  const handleClosePhotoViewer = () => {
    setViewEvent(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formTitle.trim()) {
      const newEv: GalleryEvent = {
        id: Date.now(),
        title: formTitle,
        category: formCategory,
        location: formLocation || 'Desa Mitra, Probolinggo',
        date: formDate || '01 Agustus 2026',
        coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
        photos: ['/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp'],
        description: formDescription || 'Dokumentasi kegiatan aksi lingkungan Pena Hijau.',
      };
      setEvents([newEv, ...events]);
      setIsAddModalOpen(false);
      setFormTitle('');
      setFormLocation('');
      setFormDate('');
      setFormDescription('');
      showToast('Event Galeri Baru Berhasil Ditambahkan (Simulasi Tampilan UI)!');
    }
  };

  const handleDeleteEvent = (id: number, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) {
      setEvents(events.filter((ev) => ev.id !== id));
      showToast(`Event "${title}" berhasil dihapus (Simulasi UI).`);
    }
  };

  return (
    <div className='space-y-8 p-6 sm:p-8'>
      {/* Toast Notification */}
      {notification && (
        <div className='fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 text-white px-5 py-3.5 shadow-2xl border border-green-500/50 animate-bounce'>
          <CheckCircle2 className='h-5 w-5 text-green-400' />
          <span className='text-xs sm:text-sm font-semibold'>{notification}</span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80'>
        <div>
          <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 mb-1'>
            <Images className='h-4 w-4' />
            <span>Dokumentasi Lapangan</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
            Manajemen Galeri Kegiatan
          </h2>
          <p className='text-xs sm:text-sm text-slate-600 mt-1'>
            Kelola foto dokumentasi aksi bersih sungai, reboisasi, dan edukasi di desa-desa mitra Pena Hijau.
          </p>
        </div>

        <button
          type='button'
          onClick={() => setIsAddModalOpen(true)}
          className='inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-700 hover:scale-[1.02] cursor-pointer'
        >
          <Plus className='h-4 w-4' />
          <span>Tambah Event Galeri Baru</span>
        </button>
      </div>

      {/* ── Metrics Cards Row ── */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700 font-bold'>
            <Images className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Total Event Galeri</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>{events.length} Event</p>
          </div>
        </div>

        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 font-bold'>
            <Sparkles className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Total Foto Dokumentasi</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>
              {events.reduce((acc, ev) => acc + ev.photos.length, 0)} Foto
            </p>
          </div>
        </div>

        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 font-bold'>
            <MapPin className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Desa Mitra Lapangan</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>25 Desa</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search & Category Filter ── */}
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-sm border border-slate-200/80'>
        {/* Category Pills */}
        <div className='flex flex-wrap items-center gap-2'>
          {categories.map((cat) => (
            <button
              key={cat}
              type='button'
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <input
            type='text'
            placeholder='Cari judul event atau desa...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
          />
        </div>
      </div>

      {/* ── Event Gallery Data Table ── */}
      <div className='overflow-hidden rounded-3xl bg-white shadow-md border border-slate-200/80'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs sm:text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider'>
                <th className='py-4 px-5'>Cover & Event</th>
                <th className='py-4 px-4'>Kategori</th>
                <th className='py-4 px-4'>Lokasi Desa</th>
                <th className='py-4 px-4'>Tanggal</th>
                <th className='py-4 px-4 text-center'>Foto</th>
                <th className='py-4 px-5 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 font-medium text-slate-700'>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className='py-12 text-center text-slate-500 font-medium'>
                    Tidak ditemukan data event galeri yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr key={ev.id} className='hover:bg-slate-50/60 transition-colors'>
                    {/* Cover & Title */}
                    <td className='py-4 px-5'>
                      <div className='flex items-center gap-4 min-w-[260px]'>
                        <div className='relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-xs border border-slate-200'>
                          <Image
                            src={ev.coverImage}
                            alt={ev.title}
                            fill
                            sizes='100px'
                            className='object-cover'
                          />
                        </div>
                        <div>
                          <h4 className='font-bold text-slate-900 line-clamp-1 leading-snug'>{ev.title}</h4>
                          <p className='text-xs text-slate-500 line-clamp-1 mt-0.5'>{ev.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className='py-4 px-4 whitespace-nowrap'>
                      <span className='inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200'>
                        <Tag className='h-3 w-3' />
                        {ev.category}
                      </span>
                    </td>

                    {/* Location */}
                    <td className='py-4 px-4 whitespace-nowrap text-xs text-slate-600'>
                      <div className='flex items-center gap-1.5'>
                        <MapPin className='h-3.5 w-3.5 text-green-600 shrink-0' />
                        <span>{ev.location}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className='py-4 px-4 whitespace-nowrap text-xs text-slate-500'>
                      <div className='flex items-center gap-1.5'>
                        <Calendar className='h-3.5 w-3.5 text-slate-400' />
                        <span>{ev.date}</span>
                      </div>
                    </td>

                    {/* Photos Count */}
                    <td className='py-4 px-4 text-center whitespace-nowrap'>
                      <span className='rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200'>
                        {ev.photos.length} Foto
                      </span>
                    </td>

                    {/* Actions */}
                    <td className='py-4 px-5 text-right whitespace-nowrap'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          type='button'
                          onClick={() => handleOpenPhotoViewer(ev)}
                          className='inline-flex h-9 items-center gap-1.5 rounded-xl bg-green-50 px-3 text-xs font-bold text-green-700 hover:bg-green-600 hover:text-white transition-colors cursor-pointer border border-green-200/60'
                          title='Lihat Foto Galeri'
                        >
                          <Eye className='h-3.5 w-3.5' />
                          <span>Lihat</span>
                        </button>

                        <button
                          type='button'
                          onClick={() => alert(`Edit event "${ev.title}" (UI Placeholder)`)}
                          className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
                          title='Edit Event'
                        >
                          <Edit2 className='h-3.5 w-3.5' />
                        </button>

                        <button
                          type='button'
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer'
                          title='Hapus Event'
                        >
                          <Trash2 className='h-3.5 w-3.5' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Lightbox Photo Viewer Modal ── */}
      {viewEvent && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-8 backdrop-blur-md'
          onClick={handleClosePhotoViewer}
        >
          <div
            className='relative max-w-4xl w-full rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl text-white'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type='button'
              onClick={handleClosePhotoViewer}
              className='absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-white transition-colors hover:bg-green-600 cursor-pointer border border-white/10'
              aria-label='Tutup modal'
            >
              <X className='h-6 w-6' />
            </button>

            {/* Counter Badge */}
            <div className='absolute top-4 left-4 z-20 rounded-full bg-black/60 px-3.5 py-1 text-xs font-bold text-white backdrop-blur border border-white/10'>
              {activePhotoIdx + 1} / {viewEvent.photos.length} Foto
            </div>

            {/* Main Image */}
            <div className='relative h-80 sm:h-[460px] w-full overflow-hidden bg-slate-950'>
              <Image
                key={viewEvent.photos[activePhotoIdx]}
                src={viewEvent.photos[activePhotoIdx]}
                alt={`${viewEvent.title} - Foto ${activePhotoIdx + 1}`}
                fill
                sizes='1200px'
                className='object-contain'
                priority
              />

              {viewEvent.photos.length > 1 && (
                <>
                  <button
                    type='button'
                    onClick={() =>
                      setActivePhotoIdx((prev) => (prev === 0 ? viewEvent.photos.length - 1 : prev - 1))
                    }
                    className='absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur hover:bg-green-600 transition-colors cursor-pointer border border-white/10'
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </button>

                  <button
                    type='button'
                    onClick={() =>
                      setActivePhotoIdx((prev) => (prev === viewEvent.photos.length - 1 ? 0 : prev + 1))
                    }
                    className='absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur hover:bg-green-600 transition-colors cursor-pointer border border-white/10'
                  >
                    <ChevronRight className='h-6 w-6' />
                  </button>
                </>
              )}
            </div>

            {/* Event Details Info Bar */}
            <div className='p-6 bg-slate-900 border-t border-slate-800'>
              <div className='flex flex-wrap items-center gap-3 text-xs text-emerald-400 font-semibold mb-2'>
                <span className='rounded-full bg-green-500/20 px-3 py-1 border border-green-500/30'>
                  {viewEvent.category}
                </span>
                <span className='flex items-center gap-1 text-slate-300'>
                  <MapPin className='h-3.5 w-3.5 text-green-400' />
                  {viewEvent.location}
                </span>
                <span className='flex items-center gap-1 text-slate-400'>
                  <Calendar className='h-3.5 w-3.5 text-emerald-400' />
                  {viewEvent.date}
                </span>
              </div>

              <h3 className='text-lg font-bold text-white'>{viewEvent.title}</h3>
              <p className='mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed'>{viewEvent.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Event Modal (UI Preview) ── */}
      {isAddModalOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm'
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className='relative max-w-xl w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-6'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700 font-bold'>
                  <Plus className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-slate-900'>Tambah Event Galeri Baru</h3>
                  <p className='text-xs text-slate-500'>Formulir data dokumentasi kegiatan aksi lapangan</p>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setIsAddModalOpen(false)}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className='space-y-4 text-xs sm:text-sm'>
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Judul Event Kegiatan *</label>
                <input
                  type='text'
                  required
                  placeholder='Contoh: Penanaman 1.000 Pohon Mangrove Pesisir'
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Kategori Event</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  >
                    <option value='Aksi Clean-Up'>Aksi Clean-Up</option>
                    <option value='Penghijauan'>Penghijauan</option>
                    <option value='Edukasi'>Edukasi</option>
                    <option value='Komunitas'>Komunitas</option>
                  </select>
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Tanggal Pelaksanaan</label>
                  <input
                    type='text'
                    placeholder='Contoh: 01 Agustus 2026'
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Lokasi Desa / Daerah</label>
                <input
                  type='text'
                  placeholder='Contoh: Desa Kotaanyar, Kec. Kotaanyar, Probolinggo'
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Deskripsi Singkat Event</label>
                <textarea
                  rows={3}
                  placeholder='Ringkasan kegiatan aksi relawan di lokasi...'
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Image Upload Area Placeholder */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Upload Foto Dokumentasi</label>
                <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:bg-slate-100/80 transition-colors cursor-pointer'>
                  <Upload className='h-8 w-8 text-green-600 mb-2' />
                  <p className='font-bold text-slate-800 text-xs'>Klik atau Tarik Foto Ke Sini</p>
                  <p className='text-[10px] text-slate-500 mt-1'>Format WebP, JPG, PNG (Maks 5MB / foto)</p>
                </div>
              </div>

              <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setIsAddModalOpen(false)}
                  className='rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'
                >
                  Batal
                </button>
                <button
                  type='submit'
                  className='rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-green-700 cursor-pointer'
                >
                  Simpan Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
