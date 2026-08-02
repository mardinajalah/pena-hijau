'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/api';
import Image from 'next/image';
import {
  Newspaper,
  Plus,
  Search,
  Calendar,
  User,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  X,
  ExternalLink,
  Share2,
  Tag,
  CheckCircle2,
  Clock,
  ChevronDown,
  Quote,
  BookOpen,
  Layers,
  Upload,
} from 'lucide-react';

type PillarCategory = 'Aksi Clean-Up' | 'Penghijauan' | 'Edukasi' | 'Komunitas';
type ArticleStatus = 'Dipublikasikan' | 'Draft';

interface ArticleSource {
  name: string;
  url: string;
}

interface Article {
  id: number;
  title: string;
  category: PillarCategory;
  date: string;
  location: string;
  author: string;
  excerpt: string;
  paragraphs: string[];
  quote?: string;
  image: string;
  galleryImages?: string[];
  sources: ArticleSource[];
  status: ArticleStatus;
}

const categoryConfig: Record<PillarCategory, { color: string; bg: string }> = {
  'Aksi Clean-Up': { color: 'text-green-700', bg: 'bg-green-100 border-green-200' },
  'Penghijauan': { color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200' },
  'Edukasi': { color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' },
  'Komunitas': { color: 'text-violet-700', bg: 'bg-violet-100 border-violet-200' },
};

const categories: PillarCategory[] = ['Aksi Clean-Up', 'Penghijauan', 'Edukasi', 'Komunitas'];

const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') {
    return '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp';
  }
  if (url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pena-hijau-backend.vercel.app/api/v1';
    const host = rawApiUrl.replace(/\/api\/v1\/?$/, '');
    return `${host}${url}`;
  }
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp';
};

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [viewArticle, setViewArticle] = useState<Article | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form Upload & Extra States (Add)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Add Article form state
  const [form, setForm] = useState({
    title: '',
    category: 'Aksi Clean-Up' as PillarCategory,
    date: '',
    location: '',
    author: '',
    excerpt: '',
    quote: '',
    bodyText: '',
    sources: [{ name: '', url: '' }] as ArticleSource[],
  });

  // Edit Article state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editArticleForm, setEditArticleForm] = useState({
    title: '',
    category: 'Aksi Clean-Up' as PillarCategory,
    date: '',
    location: '',
    author: '',
    excerpt: '',
    quote: '',
    bodyText: '',
    sources: [{ name: '', url: '' }] as ArticleSource[],
  });

  // Form Upload & Extra States (Edit)
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string>('');
  const [editGalleryFiles, setEditGalleryFiles] = useState<File[]>([]);
  const [editGalleryPreviews, setEditGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);

  // Helpers for Add Form Sources
  const handleAddSource = () => {
    setForm((prev) => ({
      ...prev,
      sources: [...prev.sources, { name: '', url: '' }],
    }));
  };

  const handleRemoveSource = (index: number) => {
    if (form.sources.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }));
  };

  const handleSourceChange = (index: number, field: keyof ArticleSource, value: string) => {
    setForm((prev) => ({
      ...prev,
      sources: prev.sources.map((src, i) => (i === index ? { ...src, [field]: value } : src)),
    }));
  };

  // Helpers for Edit Form Sources
  const handleEditAddSource = () => {
    setEditArticleForm((prev) => ({
      ...prev,
      sources: [...prev.sources, { name: '', url: '' }],
    }));
  };

  const handleEditRemoveSource = (index: number) => {
    if (editArticleForm.sources.length <= 1) return;
    setEditArticleForm((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, i) => i !== index),
    }));
  };

  const handleEditSourceChange = (index: number, field: keyof ArticleSource, value: string) => {
    setEditArticleForm((prev) => ({
      ...prev,
      sources: prev.sources.map((src, i) => (i === index ? { ...src, [field]: value } : src)),
    }));
  };

  const resetAddForm = () => {
    setForm({
      title: '',
      category: 'Aksi Clean-Up',
      date: '',
      location: '',
      author: '',
      excerpt: '',
      quote: '',
      bodyText: '',
      sources: [{ name: '', url: '' }],
    });
    setCoverFile(null);
    setCoverPreview('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
  };

  const handleEditArticleClick = (article: Article) => {
    setEditingArticle(article);
    setEditArticleForm({
      title: article.title,
      category: article.category,
      date: article.date || '',
      location: article.location || '',
      author: article.author || '',
      excerpt: article.excerpt || '',
      quote: article.quote || '',
      bodyText: article.paragraphs?.join('\n') || '',
      sources: article.sources && article.sources.length > 0 ? [...article.sources] : [{ name: '', url: '' }],
    });
    setEditCoverFile(null);
    setEditCoverPreview(article.image || '');
    setEditGalleryFiles([]);
    setEditGalleryPreviews([]);
    setExistingGalleryImages(article.galleryImages || []);
  };

  const handleEditArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editArticleForm.title.trim()) return;

    setIsSubmitting(true);
    let coverUrl = editCoverPreview;
    let galleryUrls = [...existingGalleryImages];

    try {
      if (editCoverFile) {
        const uploadJson = await dashboardApi.uploadSingleImage(editCoverFile, 'articles');
        if (uploadJson.data?.fullUrl || uploadJson.data?.url) {
          coverUrl = uploadJson.data.fullUrl || uploadJson.data.url;
        }
      }

      if (editGalleryFiles.length > 0) {
        const uploadJson = await dashboardApi.uploadMultipleImages(editGalleryFiles, 'articles');
        if (uploadJson.data?.files && Array.isArray(uploadJson.data.files)) {
          const newGalleryUrls = uploadJson.data.files.map((f: any) => f.fullUrl || f.url);
          galleryUrls = [...galleryUrls, ...newGalleryUrls];
        }
      }

      const paragraphs = editArticleForm.bodyText
        ? editArticleForm.bodyText.split('\n').map(p => p.trim()).filter(Boolean)
        : [editArticleForm.excerpt || 'Artikel baru Pena Hijau.'];

      const filteredSources = editArticleForm.sources
        .filter((s) => s.name.trim() !== '')
        .map((s) => ({ name: s.name, url: s.url || '#' }));

      await dashboardApi.updateArticle(editingArticle.id, {
        title: editArticleForm.title,
        category: editArticleForm.category,
        date: editArticleForm.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        location: editArticleForm.location || 'Probolinggo, Jawa Timur',
        author: editArticleForm.author || 'Tim Pena Hijau',
        excerpt: editArticleForm.excerpt || 'Artikel dokumentasi kegiatan Pena Hijau.',
        paragraphs,
        quote: editArticleForm.quote || undefined,
        image: coverUrl,
        galleryImages: galleryUrls.length > 0 ? galleryUrls : [coverUrl],
        sources: filteredSources,
        status: editingArticle.status,
      });

      showToast(`Artikel "${editArticleForm.title.slice(0, 30)}..." berhasil diperbarui.`);
      setEditingArticle(null);
      loadArticles();
    } catch (err: any) {
      showToast(err?.message || 'Gagal memperbarui artikel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      a.title.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q);
    const matchCat = selectedCategory === 'Semua' || a.category === selectedCategory;
    const matchStatus = selectedStatus === 'Semua' || a.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const loadArticles = async () => {
    try {
      const res = await dashboardApi.getArticles();
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setArticles(res.data as any);
      } else {
        setArticles([]);
      }
    } catch (err) {
      setArticles([]);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3200);
  };

  const handleOpenArticle = (article: Article) => {
    setViewArticle(article);
    setActivePhotoIdx(0);
  };

  const handleToggleStatus = async (id: number) => {
    const article = articles.find((a) => a.id === id);
    const nextStatus = article?.status === 'Dipublikasikan' ? 'Draft' : 'Dipublikasikan';
    try {
      await dashboardApi.togglePublishArticle(id, nextStatus);
      showToast(`Status artikel "${article?.title.slice(0, 30)}..." diubah ke ${nextStatus}.`);
      loadArticles();
    } catch (err) {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
      );
      showToast(`Status artikel diubah ke ${nextStatus}.`);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Hapus artikel "${title.slice(0, 50)}..."?`)) {
      try {
        await dashboardApi.deleteArticle(id);
        showToast('Artikel berhasil dihapus.');
        loadArticles();
      } catch (err) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showToast('Artikel berhasil dihapus.');
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent, status: ArticleStatus = 'Draft') => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setIsSubmitting(true);
    let coverUrl = '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp';
    let galleryUrls: string[] = [];

    try {
      if (coverFile) {
        const uploadJson = await dashboardApi.uploadSingleImage(coverFile, 'articles');
        if (uploadJson.data?.fullUrl || uploadJson.data?.url) {
          coverUrl = uploadJson.data.fullUrl || uploadJson.data.url;
        }
      }

      if (galleryFiles.length > 0) {
        const uploadJson = await dashboardApi.uploadMultipleImages(galleryFiles, 'articles');
        if (uploadJson.data?.files && Array.isArray(uploadJson.data.files)) {
          galleryUrls = uploadJson.data.files.map((f: any) => f.fullUrl || f.url);
        }
      }

      const paragraphs = form.bodyText
        ? form.bodyText.split('\n').map(p => p.trim()).filter(Boolean)
        : [form.excerpt || 'Artikel baru Pena Hijau.'];

      const filteredSources = form.sources
        .filter((s) => s.name.trim() !== '')
        .map((s) => ({ name: s.name, url: s.url || '#' }));

      await dashboardApi.createArticle({
        title: form.title,
        category: form.category,
        date: form.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        location: form.location || 'Probolinggo, Jawa Timur',
        author: form.author || 'Tim Pena Hijau',
        excerpt: form.excerpt || 'Artikel dokumentasi kegiatan Pena Hijau.',
        paragraphs,
        quote: form.quote || undefined,
        image: coverUrl,
        galleryImages: galleryUrls.length > 0 ? galleryUrls : [coverUrl],
        sources: filteredSources,
        status,
      });

      showToast(`Artikel baru berhasil disimpan sebagai ${status}!`);
      setIsAddOpen(false);
      resetAddForm();
      loadArticles();
    } catch (err: any) {
      showToast(err?.message || 'Gagal menambahkan artikel');
    } finally {
      setIsSubmitting(false);
    }
  };

  const published = articles.filter((a) => a.status === 'Dipublikasikan').length;
  const draft = articles.filter((a) => a.status === 'Draft').length;

  return (
    <div className='space-y-8 p-6 sm:p-8'>
      {/* Toast */}
      {notification && (
        <div className='fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-900 text-white px-5 py-3.5 shadow-2xl border border-green-500/50'>
          <CheckCircle2 className='h-5 w-5 text-green-400 shrink-0' />
          <span className='text-xs sm:text-sm font-semibold'>{notification}</span>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80'>
        <div>
          <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 mb-1'>
            <Newspaper className='h-4 w-4' />
            <span>Konten & Pilar Gerakan</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
            Manajemen Artikel & Pilar Aksi
          </h2>
          <p className='text-xs sm:text-sm text-slate-600 mt-1'>
            Kelola artikel berita, laporan aksi, dan konten pilar gerakan komunitas Pena Hijau yang tampil di website.
          </p>
        </div>

        <button
          type='button'
          onClick={() => setIsAddOpen(true)}
          className='inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-700 hover:scale-[1.02] cursor-pointer'
        >
          <Plus className='h-4 w-4' />
          Tulis Artikel Baru
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700'>
            <Layers className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Total Artikel</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>{articles.length} Artikel</p>
          </div>
        </div>

        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700'>
            <CheckCircle2 className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Dipublikasikan</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>{published} Artikel</p>
          </div>
        </div>

        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700'>
            <Clock className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Masih Draft</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>{draft} Artikel</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm border border-slate-200/80'>
        <div className='flex flex-wrap items-center gap-2'>
          {/* Category Pills */}
          {['Semua', ...categories].map((cat) => (
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

          {/* Status filter */}
          <div className='relative'>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className='appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-4 pr-8 text-xs font-bold text-slate-700 focus:border-green-600 focus:outline-none cursor-pointer'
            >
              <option value='Semua'>Semua Status</option>
              <option value='Dipublikasikan'>Dipublikasikan</option>
              <option value='Draft'>Draft</option>
            </select>
            <ChevronDown className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500' />
          </div>
        </div>

        {/* Search */}
        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <input
            type='text'
            placeholder='Cari judul, penulis, atau lokasi...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
          />
        </div>
      </div>

      {/* ── Articles Table ── */}
      <div className='overflow-hidden rounded-3xl bg-white shadow-md border border-slate-200/80'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs sm:text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider'>
                <th className='py-4 px-5'>Artikel</th>
                <th className='py-4 px-4'>Kategori Pilar</th>
                <th className='py-4 px-4'>Penulis</th>
                <th className='py-4 px-4'>Tanggal</th>
                <th className='py-4 px-4'>Sumber Media</th>
                <th className='py-4 px-4 text-center'>Status</th>
                <th className='py-4 px-5 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 font-medium text-slate-700'>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className='py-16 text-center'>
                    <BookOpen className='mx-auto h-10 w-10 text-slate-300 mb-3' />
                    <p className='text-slate-500 font-medium'>Tidak ada artikel yang sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => {
                  const catCfg = categoryConfig[article.category as PillarCategory] ?? { color: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' };
                  return (
                    <tr key={article.id} className='hover:bg-slate-50/60 transition-colors'>
                      {/* Cover + Title */}
                      <td className='py-4 px-5'>
                        <div className='flex items-center gap-4 min-w-67.5'>
                          <div className='relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-xs border border-slate-200'>
                            <Image
                              src={resolveImageUrl(article.image)}
                              alt={article.title}
                              fill
                              sizes='100px'
                              className='object-cover'
                            />
                          </div>
                          <div className='min-w-0'>
                            <button
                              type='button'
                              onClick={() => handleOpenArticle(article)}
                              className='font-bold text-slate-900 hover:text-green-600 transition-colors text-left leading-snug line-clamp-2 cursor-pointer'
                            >
                              {article.title}
                            </button>
                            <p className='text-[11px] text-slate-400 mt-1 line-clamp-1'>{article.excerpt}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className='py-4 px-4 whitespace-nowrap'>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${catCfg.bg} ${catCfg.color}`}>
                          <Tag className='h-3 w-3' />
                          {article.category}
                        </span>
                      </td>

                      {/* Author */}
                      <td className='py-4 px-4 text-xs text-slate-600 whitespace-nowrap'>
                        <div className='flex items-center gap-1.5'>
                          <User className='h-3.5 w-3.5 text-green-600 shrink-0' />
                          {article.author}
                        </div>
                      </td>

                      {/* Date */}
                      <td className='py-4 px-4 text-xs text-slate-500 whitespace-nowrap'>
                        <div className='flex items-center gap-1.5'>
                          <Calendar className='h-3.5 w-3.5 text-slate-400' />
                          {article.date}
                        </div>
                      </td>

                      {/* Sources */}
                      <td className='py-4 px-4 whitespace-nowrap text-xs'>
                        {article.sources.length > 0 ? (
                          <div className='flex flex-col gap-1'>
                            {article.sources.slice(0, 2).map((src) => (
                              <a
                                key={src.name}
                                href={src.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-1 text-green-600 hover:text-green-700 hover:underline font-semibold'
                              >
                                <ExternalLink className='h-3 w-3' />
                                {src.name}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className='text-slate-400 italic'>Tidak ada</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className='py-4 px-4 text-center whitespace-nowrap'>
                        <button
                          type='button'
                          onClick={() => handleToggleStatus(article.id)}
                          title='Klik untuk ubah status'
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold border transition-all cursor-pointer hover:opacity-80 ${
                            article.status === 'Dipublikasikan'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-amber-100 text-amber-700 border-amber-200'
                          }`}
                        >
                          {article.status === 'Dipublikasikan' ? (
                            <CheckCircle2 className='h-3.5 w-3.5' />
                          ) : (
                            <Clock className='h-3.5 w-3.5' />
                          )}
                          {article.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className='py-4 px-5 text-right whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            type='button'
                            onClick={() => handleOpenArticle(article)}
                            className='inline-flex h-9 items-center gap-1.5 rounded-xl bg-green-50 px-3 text-xs font-bold text-green-700 hover:bg-green-600 hover:text-white transition-colors cursor-pointer border border-green-200/60'
                            title='Baca Artikel'
                          >
                            <Eye className='h-3.5 w-3.5' />
                            <span>Baca</span>
                          </button>

                          <button
                            type='button'
                            onClick={() => handleEditArticleClick(article)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
                            title='Edit Artikel'
                          >
                            <Edit2 className='h-3.5 w-3.5' />
                          </button>

                          <button
                            type='button'
                            onClick={() => handleDelete(article.id, article.title)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer'
                            title='Hapus Artikel'
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500'>
          <span>Menampilkan <strong>{filteredArticles.length}</strong> dari <strong>{articles.length}</strong> artikel</span>
          <div className='flex items-center gap-3'>
            <span className='text-green-600 font-bold'>{published} Dipublikasikan</span>
            <span className='text-amber-600 font-bold'>{draft} Draft</span>
          </div>
        </div>
      </div>

      {/* ── Article Reader Modal ── */}
      {viewArticle && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto'
          onClick={() => setViewArticle(null)}
        >
          <div
            className='relative max-w-3xl w-full rounded-3xl bg-white shadow-2xl border border-slate-200 my-auto overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Close */}
            <div className='sticky top-0 z-20 flex items-center justify-between bg-white/95 px-6 py-4 border-b border-slate-100 backdrop-blur'>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${(categoryConfig[viewArticle.category as PillarCategory] ?? { bg: 'bg-slate-100 border-slate-200', color: 'text-slate-700' }).bg} ${(categoryConfig[viewArticle.category as PillarCategory] ?? { bg: 'bg-slate-100 border-slate-200', color: 'text-slate-700' }).color}`}>
                <Tag className='h-3 w-3' />
                {viewArticle.category}
              </span>
              <button
                type='button'
                onClick={() => setViewArticle(null)}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <div className='p-6 sm:p-10 max-h-[80vh] overflow-y-auto space-y-6'>
              {/* Title */}
              <h2 className='text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight'>
                {viewArticle.title}
              </h2>

              {/* Meta */}
              <div className='flex flex-wrap gap-4 text-xs text-slate-500 pb-4 border-b border-slate-100'>
                <span className='flex items-center gap-1.5'><Calendar className='h-4 w-4 text-green-600' />{viewArticle.date}</span>
                <span className='flex items-center gap-1.5'><MapPin className='h-4 w-4 text-green-600' />{viewArticle.location}</span>
                <span className='flex items-center gap-1.5'><User className='h-4 w-4 text-green-600' />{viewArticle.author}</span>
              </div>

              {/* Main Image */}
              <div className='relative h-64 sm:h-96 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md'>
                <Image
                  src={resolveImageUrl(viewArticle.galleryImages ? viewArticle.galleryImages[activePhotoIdx] : viewArticle.image)}
                  alt={viewArticle.title}
                  fill
                  sizes='800px'
                  className='object-cover'
                  priority
                />
              </div>

              {/* Gallery Thumbnails */}
              {viewArticle.galleryImages && viewArticle.galleryImages.length > 1 && (
                <div className='flex items-center gap-2 overflow-x-auto pb-1'>
                  {viewArticle.galleryImages.map((img, idx) => (
                    <button
                      key={img}
                      type='button'
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                        idx === activePhotoIdx
                          ? 'border-green-600 scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={resolveImageUrl(img)} alt={`Foto ${idx + 1}`} fill sizes='80px' className='object-cover' />
                    </button>
                  ))}
                </div>
              )}

              {/* Paragraphs */}
              <div className='space-y-4 text-sm sm:text-base leading-8 text-slate-700'>
                {viewArticle.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {viewArticle.quote && (
                  <blockquote className='rounded-2xl bg-green-50 p-6 border-l-4 border-green-600 text-slate-800 italic font-medium leading-relaxed'>
                    &ldquo;{viewArticle.quote}&rdquo;
                  </blockquote>
                )}
              </div>

              {/* Sources */}
              {viewArticle.sources.length > 0 && (
                <div className='pt-6 border-t border-slate-200'>
                  <p className='text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5'>
                    <Share2 className='h-4 w-4 text-green-600' />
                    Diberitakan Oleh Media Partner:
                  </p>
                  <div className='flex flex-wrap gap-3'>
                    {viewArticle.sources.map((src) => (
                      <a
                        key={src.name}
                        href={src.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-green-600 hover:text-white transition-colors'
                      >
                        {src.name}
                        <ExternalLink className='h-3.5 w-3.5' />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Add Article Modal ── */}
      {isAddOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm'
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className='relative max-w-xl w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-6'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700'>
                  <Plus className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-slate-900'>Tulis Artikel Baru</h3>
                  <p className='text-xs text-slate-500'>Tulis artikel baru beserta foto dan isinya</p>
                </div>
              </div>
              <button type='button' onClick={() => setIsAddOpen(false)} className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className='space-y-4 text-xs sm:text-sm'>
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Judul Artikel *</label>
                <input
                  type='text'
                  required
                  placeholder='Tulis judul artikel yang menarik...'
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Foto Cover Artikel (Single) *</label>
                <div className='relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer z-10'
                  />
                  {coverPreview ? (
                    <div className='relative h-36 w-full rounded-xl overflow-hidden'>
                      <Image src={coverPreview} alt='Cover Preview' fill className='object-cover' />
                    </div>
                  ) : (
                    <div className='py-4 text-slate-500'>
                      <Upload className='mx-auto h-7 w-7 text-slate-400 mb-1.5' />
                      <p className='text-xs font-semibold'>Klik atau drag foto cover di sini</p>
                      <p className='text-[10px] text-slate-400 mt-1'>Format WebP, JPG, PNG (Maks 10MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Pillar & Date */}
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Kategori Pilar</label>
                  <div className='relative'>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as PillarCategory })}
                      className='w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 py-3 pl-4 pr-8 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 cursor-pointer'
                    >
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                  </div>
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Tanggal Penulisan</label>
                  <input
                    type='text'
                    placeholder='01 Agustus 2026'
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>
              </div>

              {/* Location & Author */}
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Lokasi Kegiatan</label>
                  <input
                    type='text'
                    placeholder='Kec. Kotaanyar, Probolinggo'
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Nama Penulis</label>
                  <input
                    type='text'
                    placeholder='Taufiqur Rohim'
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Ringkasan / Excerpt Artikel *</label>
                <textarea
                  rows={2}
                  required
                  placeholder='Ringkasan singkat isi artikel (maksimal 2-3 kalimat)...'
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Kutipan (Quote) */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Kutipan Kegiatan (Quote - Opsional)</label>
                <textarea
                  rows={2}
                  placeholder='Contoh: "Sungai adalah urat nadi kehidupan..."'
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Isi Artikel Paragraf */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Isi Artikel Lengkap (Gunakan Enter / Baris Baru untuk Paragraf Baru) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder='Tulis seluruh isi paragraf artikel di sini...'
                  value={form.bodyText}
                  onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Gallery Images Upload */}
              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <label className='block font-bold text-slate-900'>Galeri Foto Pendukung ({galleryPreviews.length} Foto)</label>
                </div>
                <div className='relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setGalleryFiles((prev) => [...prev, ...files]);
                        const newUrls = files.map((f) => URL.createObjectURL(f));
                        setGalleryPreviews((prev) => [...prev, ...newUrls]);
                      }
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer z-10'
                  />
                  <div className='py-3 text-slate-500'>
                    <Upload className='mx-auto h-7 w-7 text-slate-400 mb-1.5' />
                    <p className='text-xs font-semibold'>Klik atau drag foto-foto galeri kegiatan di sini</p>
                  </div>
                </div>
                {galleryPreviews.length > 0 && (
                  <div className='mt-3 grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1'>
                    {galleryPreviews.map((url, idx) => (
                      <div key={idx} className='relative h-16 rounded-xl overflow-hidden border border-slate-200'>
                        <Image src={url} alt={`Gallery Preview ${idx + 1}`} fill className='object-cover' />
                        <button
                          type='button'
                          onClick={() => {
                            setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                            setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors'
                        >
                          <X className='h-2.5 w-2.5' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Media Partners Section (Add) */}
              <div className='space-y-3 pt-2 border-t border-slate-100'>
                <div className='flex items-center justify-between'>
                  <label className='block font-bold text-slate-900'>Media Partner / Sumber Berita ({form.sources.length})</label>
                  <button
                    type='button'
                    onClick={handleAddSource}
                    className='text-xs font-bold text-green-600 hover:text-green-700 hover:underline cursor-pointer'
                  >
                    + Tambah Media
                  </button>
                </div>
                {form.sources.map((src, idx) => (
                  <div key={idx} className='flex items-end gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 relative group'>
                    <div className='grid gap-3 sm:grid-cols-2 flex-1'>
                      <div>
                        <label className='block text-[11px] font-bold text-slate-500 mb-1'>Nama Media Partner</label>
                        <input
                          type='text'
                          placeholder='Contoh: Berdampak.net'
                          value={src.name}
                          onChange={(e) => handleSourceChange(idx, 'name', e.target.value)}
                          className='w-full rounded-xl border border-slate-300 bg-white py-2 px-3.5 font-medium focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20'
                        />
                      </div>
                      <div>
                        <label className='block text-[11px] font-bold text-slate-500 mb-1'>URL Sumber Berita</label>
                        <input
                          type='url'
                          placeholder='https://...'
                          value={src.url}
                          onChange={(e) => handleSourceChange(idx, 'url', e.target.value)}
                          className='w-full rounded-xl border border-slate-300 bg-white py-2 px-3.5 font-medium focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20'
                        />
                      </div>
                    </div>
                    {form.sources.length > 1 && (
                      <button
                        type='button'
                        onClick={() => handleRemoveSource(idx)}
                        className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer shrink-0'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setIsAddOpen(false)}
                  className='rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'
                >
                  Batal
                </button>
                <button
                  type='button'
                  disabled={isSubmitting}
                  onClick={(e) => handleAddSubmit(e, 'Draft')}
                  className='rounded-xl bg-slate-200 px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-300 cursor-pointer disabled:opacity-50'
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <button
                  type='button'
                  disabled={isSubmitting}
                  onClick={(e) => handleAddSubmit(e, 'Dipublikasikan')}
                  className='rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-green-700 cursor-pointer disabled:opacity-50'
                >
                  {isSubmitting ? 'Mengunggah...' : 'Publikasikan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Artikel */}
      {editingArticle && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto'
          onClick={() => setEditingArticle(null)}
        >
          <div
            className='relative max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-6'>
              <h3 className='text-lg font-bold text-slate-900'>Edit Artikel & Pilar Gerakan</h3>
              <button
                type='button'
                onClick={() => setEditingArticle(null)}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={handleEditArticleSubmit} className='space-y-4 text-xs sm:text-sm'>
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Judul Artikel *</label>
                <input
                  type='text'
                  required
                  value={editArticleForm.title}
                  onChange={(e) => setEditArticleForm({ ...editArticleForm, title: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Cover Image Upload (Edit) */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Foto Cover Artikel (Single) *</label>
                <div className='relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditCoverFile(file);
                        setEditCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer z-10'
                  />
                  {editCoverPreview ? (
                    <div className='relative h-36 w-full rounded-xl overflow-hidden'>
                      <Image src={editCoverPreview} alt='Cover Preview' fill className='object-cover' />
                    </div>
                  ) : (
                    <div className='py-4 text-slate-500'>
                      <Upload className='mx-auto h-7 w-7 text-slate-400 mb-1.5' />
                      <p className='text-xs font-semibold'>Klik atau drag foto cover di sini</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Category, Date, Author, Location */}
              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Kategori Pilar</label>
                  <select
                    value={editArticleForm.category}
                    onChange={(e) => setEditArticleForm({ ...editArticleForm, category: e.target.value as PillarCategory })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Tanggal Penulisan</label>
                  <input
                    type='text'
                    value={editArticleForm.date}
                    onChange={(e) => setEditArticleForm({ ...editArticleForm, date: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Lokasi Kegiatan</label>
                  <input
                    type='text'
                    value={editArticleForm.location}
                    onChange={(e) => setEditArticleForm({ ...editArticleForm, location: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Penulis / Kontributor</label>
                  <input
                    type='text'
                    value={editArticleForm.author}
                    onChange={(e) => setEditArticleForm({ ...editArticleForm, author: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Ringkasan / Excerpt Artikel *</label>
                <textarea
                  rows={2}
                  required
                  value={editArticleForm.excerpt}
                  onChange={(e) => setEditArticleForm({ ...editArticleForm, excerpt: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Quote */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Kutipan Kegiatan (Quote - Opsional)</label>
                <textarea
                  rows={2}
                  value={editArticleForm.quote}
                  onChange={(e) => setEditArticleForm({ ...editArticleForm, quote: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Paragraphs (bodyText) */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Isi Artikel Lengkap (Gunakan Enter / Baris Baru untuk Paragraf Baru) *</label>
                <textarea
                  rows={6}
                  required
                  value={editArticleForm.bodyText}
                  onChange={(e) => setEditArticleForm({ ...editArticleForm, bodyText: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Gallery Images (Edit) */}
              <div>
                <div className='flex items-center justify-between mb-1.5'>
                  <label className='block font-bold text-slate-900'>Galeri Foto Pendukung (Total: {existingGalleryImages.length + editGalleryPreviews.length} Foto)</label>
                </div>

                {/* Existing Gallery list */}
                {existingGalleryImages.length > 0 && (
                  <div className='mb-3'>
                    <p className='text-xs font-bold text-slate-500 mb-1.5'>Foto Tersimpan:</p>
                    <div className='grid grid-cols-4 gap-2 p-1 border border-slate-100 rounded-xl bg-slate-50'>
                      {existingGalleryImages.map((url, idx) => (
                        <div key={idx} className='relative h-16 rounded-xl overflow-hidden border border-slate-200'>
                          <Image src={url} alt={`Existing Gallery ${idx + 1}`} fill className='object-cover' />
                          <button
                            type='button'
                            onClick={() => {
                              setExistingGalleryImages((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors'
                          >
                            <X className='h-2.5 w-2.5' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Gallery upload area */}
                <div className='relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors'>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setEditGalleryFiles((prev) => [...prev, ...files]);
                        const newUrls = files.map((f) => URL.createObjectURL(f));
                        setEditGalleryPreviews((prev) => [...prev, ...newUrls]);
                      }
                    }}
                    className='absolute inset-0 opacity-0 cursor-pointer z-10'
                  />
                  <div className='py-3 text-slate-500'>
                    <Upload className='mx-auto h-7 w-7 text-slate-400 mb-1.5' />
                    <p className='text-xs font-semibold'>Klik atau drag untuk tambah foto baru ke galeri</p>
                  </div>
                </div>

                {editGalleryPreviews.length > 0 && (
                  <div className='mt-3'>
                    <p className='text-xs font-bold text-slate-500 mb-1.5'>Foto Baru yang Akan Diunggah:</p>
                    <div className='grid grid-cols-4 gap-2 p-1 border border-slate-100 rounded-xl bg-slate-50'>
                      {editGalleryPreviews.map((url, idx) => (
                        <div key={idx} className='relative h-16 rounded-xl overflow-hidden border border-slate-200'>
                          <Image src={url} alt={`New Gallery Preview ${idx + 1}`} fill className='object-cover' />
                          <button
                            type='button'
                            onClick={() => {
                              setEditGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                              setEditGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors'
                          >
                            <X className='h-2.5 w-2.5' />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Media Partners Section (Edit) */}
              <div className='space-y-3 pt-2 border-t border-slate-100'>
                <div className='flex items-center justify-between'>
                  <label className='block font-bold text-slate-900'>Media Partner / Sumber Berita ({editArticleForm.sources.length})</label>
                  <button
                    type='button'
                    onClick={handleEditAddSource}
                    className='text-xs font-bold text-green-600 hover:text-green-700 hover:underline cursor-pointer'
                  >
                    + Tambah Media
                  </button>
                </div>
                {editArticleForm.sources.map((src, idx) => (
                  <div key={idx} className='flex items-end gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 relative group'>
                    <div className='grid gap-3 sm:grid-cols-2 flex-1'>
                      <div>
                        <label className='block text-[11px] font-bold text-slate-500 mb-1'>Nama Media Partner</label>
                        <input
                          type='text'
                          placeholder='Contoh: Berdampak.net'
                          value={src.name}
                          onChange={(e) => handleEditSourceChange(idx, 'name', e.target.value)}
                          className='w-full rounded-xl border border-slate-300 bg-white py-2 px-3.5 font-medium focus:border-green-600 focus:outline-none'
                        />
                      </div>
                      <div>
                        <label className='block text-[11px] font-bold text-slate-500 mb-1'>URL Sumber Berita</label>
                        <input
                          type='url'
                          placeholder='https://...'
                          value={src.url}
                          onChange={(e) => handleEditSourceChange(idx, 'url', e.target.value)}
                          className='w-full rounded-xl border border-slate-300 bg-white py-2 px-3.5 font-medium focus:border-green-600 focus:outline-none'
                        />
                      </div>
                    </div>
                    {editArticleForm.sources.length > 1 && (
                      <button
                        type='button'
                        onClick={() => handleEditRemoveSource(idx)}
                        className='flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer shrink-0'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setEditingArticle(null)}
                  className='rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'
                >
                  Batal
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-green-700 cursor-pointer disabled:opacity-50'
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
