'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Images,
  Plus,
  Search,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';

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

const categoryConfig: Record<GalleryEvent['category'], { color: string; bg: string }> = {
  'Aksi Clean-Up': { color: 'text-green-700', bg: 'bg-green-100 border-green-200' },
  'Penghijauan': { color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200' },
  'Edukasi': { color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' },
  'Komunitas': { color: 'text-violet-700', bg: 'bg-violet-100 border-violet-200' },
};

const getBackendHost = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
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

const GalleryPage = () => {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeLightbox, setActiveLightbox] = useState<{ event: GalleryEvent; photoIndex: number } | null>(null);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);

  const [form, setForm] = useState({
    title: '',
    category: 'Aksi Clean-Up' as GalleryEvent['category'],
    location: '',
    date: '',
    description: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  const loadGalleries = async () => {
    try {
      const res = await dashboardApi.getGalleries();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: GalleryEvent[] = res.data.map((g: any) => ({
          id: g.id,
          title: g.title,
          category: g.category || 'Aksi Clean-Up',
          location: g.location,
          date: g.date,
          coverImage: resolveImageUrl(g.coverImage || g.photos?.[0]?.url),
          photos: g.photos?.map((p: any) => resolveImageUrl(typeof p === 'string' ? p : p.url)) || [resolveImageUrl(g.coverImage)],
          description: g.description,
        }));
        setEvents(mapped);
      } else {
        setEvents([]);
      }
    } catch (err) {
      setEvents([]);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      const newUrls = files.map((f) => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setCoverIndex((prevIdx) => {
      if (prevIdx === index) return 0;
      if (prevIdx > index) return prevIdx - 1;
      return prevIdx;
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setIsSubmitting(true);
    let defaultCover = '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp';
    let photoItems: { id: number; url: string; caption?: string }[] = [];

    try {
      if (selectedFiles.length > 0) {
        const uploadJson = await dashboardApi.uploadMultipleImages(selectedFiles, 'galleries');
        if (uploadJson.data?.files && Array.isArray(uploadJson.data.files)) {
          const uploadedUrls = uploadJson.data.files.map((f: any) => f.fullUrl || f.url);
          photoItems = uploadedUrls.map((url: string, index: number) => ({
            id: Date.now() + index,
            url,
          }));
          defaultCover = uploadedUrls[coverIndex] || uploadedUrls[0];
        }
      }

      if (photoItems.length === 0) {
        photoItems = [{ id: Date.now(), url: defaultCover }];
      }

      await dashboardApi.createGallery({
        title: form.title,
        category: form.category,
        location: form.location || 'Desa Kotaanyar, Probolinggo',
        date: form.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        coverImage: defaultCover,
        photos: photoItems,
        description: form.description || 'Dokumentasi kegiatan aksi relawan Pena Hijau.',
      });

      showToast('Event galeri baru berhasil dibuat dan tersimpan!');
      setIsAddOpen(false);
      setForm({ title: '', category: 'Aksi Clean-Up', location: '', date: '', description: '' });
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCoverIndex(0);
      loadGalleries();
    } catch (error: any) {
      showToast(error?.message || 'Gagal menambahkan event galeri');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevPhoto = () => {
    if (!activeLightbox) return;
    setActiveLightbox((prev) => {
      if (!prev) return null;
      const newIndex = prev.photoIndex === 0 ? prev.event.photos.length - 1 : prev.photoIndex - 1;
      return { ...prev, photoIndex: newIndex };
    });
  };

  const handleNextPhoto = () => {
    if (!activeLightbox) return;
    setActiveLightbox((prev) => {
      if (!prev) return null;
      const newIndex = prev.photoIndex === prev.event.photos.length - 1 ? 0 : prev.photoIndex + 1;
      return { ...prev, photoIndex: newIndex };
    });
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus event galeri "${title}"?`)) {
      try {
        await dashboardApi.deleteGallery(id);
        showToast('Event galeri berhasil dihapus.');
        loadGalleries();
      } catch (err) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        showToast('Event galeri berhasil dihapus.');
      }
    }
  };

  const filteredEvents = events.filter((ev) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'Semua' || ev.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className='space-y-8 p-6 sm:p-8'>
      {notification && (
        <div className='fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 text-white px-5 py-3.5 shadow-2xl border border-green-500/50 text-xs sm:text-sm font-semibold'>
          <CheckCircle2 className='h-5 w-5 text-green-400 shrink-0' />
          {notification}
        </div>
      )}

      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80'>
        <div>
          <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 mb-1'>
            <Images className='h-4 w-4' />
            <span>Dokumentasi Kegiatan</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
            Galeri Foto & Aksi Lapangan
          </h2>
          <p className='text-xs sm:text-sm text-slate-600 mt-1'>
            Kelola dokumentasi foto kegiatan, aksi bersih sungai, dan penghijauan desa mitra.
          </p>
        </div>

        <button
          type='button'
          onClick={() => setIsAddOpen(true)}
          className='inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-700 hover:scale-[1.02] cursor-pointer'
        >
          <Plus className='h-4 w-4' />
          Tambah Event Galeri
        </button>
      </div>

      {/* Toolbar */}
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm border border-slate-200/80'>
        <div className='flex flex-wrap items-center gap-2'>
          {['Semua', 'Aksi Clean-Up', 'Penghijauan', 'Edukasi', 'Komunitas'].map((cat) => (
            <button
              key={cat}
              type='button'
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <input
            type='text'
            placeholder='Cari judul atau lokasi event...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredEvents.map((event) => {
          const cfg = categoryConfig[event.category];
          return (
            <div
              key={event.id}
              className='group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md border border-slate-200/80 transition-all hover:shadow-xl hover:-translate-y-1'
            >
              <div className='relative h-56 w-full overflow-hidden bg-slate-100'>
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <div className='absolute top-3 left-3'>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold border backdrop-blur ${cfg.bg} ${cfg.color}`}>
                    {event.category}
                  </span>
                </div>
                <div className='absolute bottom-3 right-3'>
                  <span className='rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur'>
                    {event.photos.length} Foto
                  </span>
                </div>
              </div>

              <div className='flex flex-1 flex-col p-5 sm:p-6'>
                <h3 className='text-base font-bold text-slate-900 line-clamp-2 leading-snug'>
                  {event.title}
                </h3>
                <p className='mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed'>
                  {event.description}
                </p>

                <div className='mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100'>
                  <span className='flex items-center gap-1 text-green-700 font-semibold truncate max-w-37.5'>
                    <MapPin className='h-3.5 w-3.5 shrink-0' /> {event.location}
                  </span>
                  <span className='flex items-center gap-1'>
                    <Calendar className='h-3.5 w-3.5 shrink-0 text-slate-400' /> {event.date}
                  </span>
                </div>

                <div className='mt-5 flex items-center justify-between gap-2 pt-3 border-t border-slate-100'>
                  <button
                    type='button'
                    onClick={() => setActiveLightbox({ event, photoIndex: 0 })}
                    className='inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
                  >
                    <Eye className='h-3.5 w-3.5' /> Lihat Photos
                  </button>

                  <button
                    type='button'
                    onClick={() => handleDelete(event.id, event.title)}
                    className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Event */}
      {isAddOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm' onClick={() => setIsAddOpen(false)}>
          <div className='relative max-w-lg w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-6'>
              <h3 className='text-lg font-bold text-slate-900'>Tambah Event Galeri Baru</h3>
              <button type='button' onClick={() => setIsAddOpen(false)} className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className='space-y-4 text-xs sm:text-sm'>
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Judul Event *</label>
                <input
                  type='text'
                  required
                  placeholder='Contoh: Aksi Clean Up Sungai Kotaanyar'
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none'
                />
              </div>

              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <label className='block font-bold text-slate-900'>Dokumentasi Foto Kegiatan ({previewUrls.length} Foto)</label>
                  {previewUrls.length > 0 && (
                    <span className='text-xs font-semibold text-green-700'>
                      Foto sampul: #{coverIndex + 1}
                    </span>
                  )}
                </div>

                <div className='relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={handleFileChange}
                    className='absolute inset-0 opacity-0 cursor-pointer z-10'
                  />
                  <div className='py-3 text-slate-500'>
                    <Upload className='mx-auto h-7 w-7 text-slate-400 mb-1.5' />
                    <p className='text-xs font-semibold'>Klik atau drag foto-foto di sini (bisa pilih lebih dari 1 foto)</p>
                    <p className='text-[10px] text-slate-400 mt-0.5'>Format WebP, JPG, PNG (Maks 10 Foto sekaligus)</p>
                  </div>
                </div>

                {previewUrls.length > 0 && (
                  <div className='mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1'>
                    {previewUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className={`group relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          coverIndex === idx ? 'border-green-600 ring-2 ring-green-600/30' : 'border-slate-200 hover:border-slate-400'
                        }`}
                        onClick={() => setCoverIndex(idx)}
                      >
                        <Image src={url} alt={`Preview ${idx + 1}`} fill className='object-cover' />
                        {coverIndex === idx && (
                          <span className='absolute top-1 left-1 rounded bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow z-20'>
                            Sampul
                          </span>
                        )}
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className='absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors z-20'
                          title='Hapus foto ini'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Kategori Event</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none'
                  >
                    <option value='Aksi Clean-Up'>Aksi Clean-Up</option>
                    <option value='Penghijauan'>Penghijauan</option>
                    <option value='Edukasi'>Edukasi</option>
                    <option value='Komunitas'>Komunitas</option>
                  </select>
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Lokasi Kegiatan</label>
                  <input
                    type='text'
                    placeholder='Desa Kotaanyar, Probolinggo'
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none'
                  />
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder='Ringkasan kegiatan aksi relawan...'
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none'
                />
              </div>

              <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                <button type='button' onClick={() => setIsAddOpen(false)} className='rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'>
                  Batal
                </button>
                <button type='submit' disabled={isSubmitting} className='rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-green-700 cursor-pointer disabled:opacity-50'>
                  {isSubmitting ? 'Mengunggah...' : 'Simpan Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      {activeLightbox && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-6 backdrop-blur-md transition-opacity duration-300'
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className='relative flex max-h-[92vh] max-w-5xl w-full flex-col overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between border-b border-slate-800 px-6 py-4'>
              <div className='min-w-0 pr-4'>
                <div className='flex items-center gap-2'>
                  <span className='rounded-full bg-green-500/20 px-3 py-0.5 text-[11px] font-bold text-green-300 border border-green-500/30'>
                    {activeLightbox.event.category}
                  </span>
                  <span className='text-xs text-slate-400 font-medium'>
                    Foto {activeLightbox.photoIndex + 1} dari {activeLightbox.event.photos.length}
                  </span>
                </div>
                <h3 className='mt-1 text-base sm:text-lg font-bold text-white truncate'>
                  {activeLightbox.event.title}
                </h3>
              </div>

              <button
                type='button'
                onClick={() => setActiveLightbox(null)}
                className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='relative flex flex-1 items-center justify-center bg-black/60 min-h-80 sm:min-h-120'>
              <div className='relative h-full w-full p-4 flex items-center justify-center'>
                <div className='relative h-[50vh] sm:h-[65vh] w-full'>
                  <Image
                    src={activeLightbox.event.photos[activeLightbox.photoIndex] || activeLightbox.event.coverImage}
                    alt={`${activeLightbox.event.title} - Foto ${activeLightbox.photoIndex + 1}`}
                    fill
                    sizes='1000px'
                    className='object-contain'
                    priority
                  />
                </div>
              </div>

              {activeLightbox.event.photos.length > 1 && (
                <>
                  <button
                    type='button'
                    onClick={handlePrevPhoto}
                    className='absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 hover:scale-110 cursor-pointer shadow-lg border border-slate-800'
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </button>
                  <button
                    type='button'
                    onClick={handleNextPhoto}
                    className='absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-all hover:bg-green-600 hover:scale-110 cursor-pointer shadow-lg border border-slate-800'
                  >
                    <ChevronRight className='h-6 w-6' />
                  </button>
                </>
              )}
            </div>

            {activeLightbox.event.photos.length > 1 && (
              <div className='flex items-center gap-2 overflow-x-auto border-t border-slate-800 p-4 scrollbar-thin bg-slate-950/40'>
                {activeLightbox.event.photos.map((img, idx) => (
                  <button
                    key={img}
                    type='button'
                    onClick={() => setActiveLightbox({ event: activeLightbox.event, photoIndex: idx })}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      idx === activeLightbox.photoIndex
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
    </div>
  );
};

export default GalleryPage;
