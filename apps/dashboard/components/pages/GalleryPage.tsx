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

const GalleryPage = () => {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeLightbox, setActiveLightbox] = useState<{ event: GalleryEvent; photoIndex: number } | null>(null);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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
      if (res.data && Array.isArray(res.data)) {
        const mapped: GalleryEvent[] = res.data.map((g: any) => ({
          id: g.id,
          title: g.title,
          category: g.category || 'Aksi Clean-Up',
          location: g.location,
          date: g.date,
          coverImage: g.coverImage || g.photos?.[0]?.url || '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
          photos: g.photos?.map((p: any) => p.url) || [g.coverImage],
          description: g.description,
        }));
        setEvents(mapped);
      }
    } catch (err) {
      setEvents([]);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setIsSubmitting(true);
    let imageUrl = '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp';

    try {
      // Upload image file to backend API if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('category', 'galleries');

        const uploadRes = await fetch('http://localhost:4000/api/v1/uploads/single', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.data?.url) {
          imageUrl = uploadJson.data.url;
        }
      }

      await dashboardApi.createGallery({
        title: form.title,
        category: form.category,
        location: form.location || 'Desa Kotaanyar, Probolinggo',
        date: form.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        coverImage: imageUrl,
        photos: [{ id: Date.now(), url: imageUrl }],
        description: form.description || 'Dokumentasi kegiatan aksi relawan Pena Hijau.',
      });

      showToast('Event galeri baru berhasil dibuat dan tersimpan!');
      setIsAddOpen(false);
      setForm({ title: '', category: 'Aksi Clean-Up', location: '', date: '', description: '' });
      setSelectedFile(null);
      setPreviewUrl('');
      loadGalleries();
    } catch (error) {
      showToast('Event galeri ditambahkan secara lokal');
      setIsAddOpen(false);
    } finally {
      setIsSubmitting(false);
    }
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
                <label className='block font-bold text-slate-900 mb-1.5'>File Foto Cover Kegiatan</label>
                <div className='relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors'>
                  <input type='file' accept='image/*' onChange={handleFileChange} className='absolute inset-0 opacity-0 cursor-pointer' />
                  {previewUrl ? (
                    <div className='relative h-36 w-full rounded-xl overflow-hidden'>
                      <Image src={previewUrl} alt='Preview' fill className='object-cover' />
                    </div>
                  ) : (
                    <div className='py-4 text-slate-500'>
                      <Upload className='mx-auto h-8 w-8 text-slate-400 mb-2' />
                      <p className='text-xs font-semibold'>Klik atau drag file foto di sini</p>
                      <p className='text-[10px] text-slate-400 mt-1'>Format WebP, JPG, PNG (Maks 10MB)</p>
                    </div>
                  )}
                </div>
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
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md' onClick={() => setActiveLightbox(null)}>
          <div className='relative max-w-4xl w-full max-h-[90vh] rounded-3xl bg-slate-900 p-6 text-white shadow-2xl border border-slate-800' onClick={(e) => e.stopPropagation()}>
            <div className='flex items-center justify-between border-b border-slate-800 pb-4 mb-4'>
              <h3 className='font-bold text-lg text-white truncate'>{activeLightbox.event.title}</h3>
              <button type='button' onClick={() => setActiveLightbox(null)} className='flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='relative h-[60vh] w-full overflow-hidden rounded-2xl bg-black/60 flex items-center justify-center'>
              <Image src={activeLightbox.event.photos[activeLightbox.photoIndex] || activeLightbox.event.coverImage} alt='Photo' fill className='object-contain' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
