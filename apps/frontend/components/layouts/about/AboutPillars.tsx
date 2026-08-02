'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, X, Calendar, MapPin, ExternalLink, User, Share2, BookOpen } from 'lucide-react';
import { frontendApi } from '@/lib/api';

interface ArticleData {
  id?: number;
  title: string;
  category?: string;
  date: string;
  location: string;
  author: string;
  image: string;
  galleryImages?: string[];
  excerpt: string;
  paragraphs: string[];
  quote?: string;
  sources: {
    name: string;
    url: string;
  }[];
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

const AboutPillars = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await frontendApi.getArticles();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setArticles(res.data);
        } else {
          setArticles([]);
        }
      } catch (err) {
        setArticles([]);
      }
    }
    loadArticles();
  }, []);

  const handleOpenArticle = (article?: ArticleData) => {
    if (article) {
      setSelectedArticle(article);
      setActivePhotoIdx(0);
    }
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <section className='bg-slate-50 py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Pilar Gerakan</p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Fokus Utama Program Pena Hijau</h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>Kami berfokus pada pilar utama yang saling melengkapi untuk mencapai perubahan dampak ekologis yang luas.</p>
        </div>

        {articles.length === 0 ? (
          <div className='mt-16 text-center py-12 rounded-3xl bg-white border border-slate-200/80 max-w-md mx-auto'>
            <BookOpen className='mx-auto h-10 w-10 text-slate-300 mb-3' />
            <p className='text-slate-500 font-medium text-sm'>Belum ada artikel pilar yang dipublikasikan.</p>
          </div>
        ) : (
          <div className='mt-16 grid gap-8 md:grid-cols-3'>
            {articles.map((item) => (
              <article
                key={item.id || item.title}
                onClick={() => handleOpenArticle(item)}
                className='group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-900/10 cursor-pointer border border-slate-100'
              >
                <div className='relative h-60 w-full overflow-hidden bg-slate-100'>
                  <Image
                    src={resolveImageUrl(item.image)}
                    alt={item.title}
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    className='object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute top-4 left-4'>
                    <span className='rounded-full bg-emerald-950/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur border border-white/20'>
                      {item.category || 'Pilar Aksi'}
                    </span>
                  </div>
                </div>

                <div className='flex flex-1 flex-col p-6 sm:p-8'>
                  <p className='text-xs font-bold uppercase tracking-wider text-green-600'>{item.category || 'Berita & Laporan'}</p>
                  <h3 className='mt-2 text-xl font-bold text-slate-900 group-hover:text-green-700 transition-colors line-clamp-2'>{item.title}</h3>
                  <p className='mt-3 flex-1 text-sm leading-7 text-slate-600 line-clamp-3'>{item.excerpt}</p>

                  <div className='mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-green-600 group-hover:text-green-700'>
                    <span>Pelajari Selengkapnya</span>
                    <ArrowUpRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm transition-opacity duration-300 overflow-y-auto'
          onClick={handleCloseArticle}
        >
          <div
            className='relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 my-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type='button'
              onClick={handleCloseArticle}
              className='sticky top-4 right-4 ml-auto mr-4 mt-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition-colors hover:bg-green-600 cursor-pointer shadow-md'
              aria-label='Tutup artikel'
            >
              <X className='h-5 w-5' />
            </button>

            <div className='p-6 sm:p-10 -mt-10'>
              <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-700'>
                <span>{selectedArticle.category || 'Berita & Aksi Lapangan'}</span>
              </div>

              <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight'>
                {selectedArticle.title}
              </h2>

              <div className='mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-4 border-t border-slate-100'>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='h-4 w-4 text-green-600' />
                  <span>{selectedArticle.date}</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <MapPin className='h-4 w-4 text-green-600' />
                  <span>{selectedArticle.location}</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <User className='h-4 w-4 text-green-600' />
                  <span>{selectedArticle.author}</span>
                </div>
              </div>

              <div className='relative mt-6 h-72 sm:h-96 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md'>
                <Image
                  src={resolveImageUrl(selectedArticle.galleryImages ? selectedArticle.galleryImages[activePhotoIdx] : selectedArticle.image)}
                  alt={selectedArticle.title}
                  fill
                  sizes='800px'
                  className='object-cover'
                  priority
                />
              </div>

              {selectedArticle.galleryImages && selectedArticle.galleryImages.length > 1 && (
                <div className='mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin'>
                  {selectedArticle.galleryImages.map((img, idx) => (
                    <button
                      key={img}
                      type='button'
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                        idx === activePhotoIdx ? 'border-green-600 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={resolveImageUrl(img)} alt={`Foto ${idx + 1}`} fill sizes='80px' className='object-cover' />
                    </button>
                  ))}
                </div>
              )}

              <div className='mt-8 space-y-5 text-base leading-8 text-slate-700'>
                {selectedArticle.paragraphs?.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {selectedArticle.quote && (
                  <blockquote className='my-6 rounded-2xl bg-green-50/80 p-6 border-l-4 border-green-600 text-slate-800 italic font-medium leading-relaxed'>
                    &ldquo;{selectedArticle.quote}&rdquo;
                  </blockquote>
                )}
              </div>

              {selectedArticle.sources && selectedArticle.sources.length > 0 && (
                <div className='mt-10 pt-6 border-t border-slate-200'>
                  <p className='text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5'>
                    <Share2 className='h-4 w-4 text-green-600' />
                    <span>Diberitakan Oleh Media Partner:</span>
                  </p>
                  <div className='flex flex-wrap gap-3'>
                    {selectedArticle.sources.map((src) => (
                      <a
                        key={src.name}
                        href={src.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 transition-colors hover:bg-green-600 hover:text-white'
                      >
                        <span>{src.name}</span>
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
    </section>
  );
};

export default AboutPillars;
