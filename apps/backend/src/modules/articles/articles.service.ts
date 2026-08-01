import { ArticlesRepository, ArticleDocument } from './articles.repository';

export interface ArticleQueryOptions {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  isPublic?: boolean;
}

export class ArticlesService {
  private articlesRepository: ArticlesRepository;

  constructor() {
    this.articlesRepository = new ArticlesRepository();
  }

  async getAllArticles(options: ArticleQueryOptions = {}) {
    const all = await this.articlesRepository.findAll();

    let filtered = [...all];

    if (options.isPublic) {
      filtered = filtered.filter((a) => a.status === 'Dipublikasikan');
    } else if (options.status && options.status !== 'Semua') {
      filtered = filtered.filter((a) => a.status === options.status);
    }

    if (options.category && options.category !== 'Semua') {
      filtered = filtered.filter((a) => a.category === options.category);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q),
      );
    }

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      summary: {
        totalArticles: all.length,
        publishedCount: all.filter((a) => a.status === 'Dipublikasikan').length,
        draftCount: all.filter((a) => a.status === 'Draft').length,
      },
    };
  }

  async getArticleById(id: number) {
    const article = await this.articlesRepository.findById(id);
    if (!article) {
      throw { statusCode: 404, message: 'Artikel tidak ditemukan' };
    }
    return article;
  }

  async createArticle(data: Partial<ArticleDocument>) {
    if (!data.title?.trim()) {
      throw { statusCode: 400, message: 'Judul artikel wajib diisi' };
    }

    const newArticleData: Omit<ArticleDocument, 'id' | 'createdAt'> = {
      title: data.title,
      category: (data.category as any) || 'Aksi Clean-Up',
      date: data.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      location: data.location || 'Probolinggo, Jawa Timur',
      author: data.author || 'Taufiqur Rohim',
      excerpt: data.excerpt || 'Artikel dokumentasi kegiatan Pena Hijau.',
      paragraphs: data.paragraphs || [data.excerpt || 'Artikel baru Pena Hijau.'],
      quote: data.quote,
      image: data.image || '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      galleryImages: data.galleryImages || ['/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp'],
      sources: data.sources || [],
      status: (data.status as any) || 'Draft',
    };

    return await this.articlesRepository.create(newArticleData);
  }

  async updateArticle(id: number, data: Partial<ArticleDocument>) {
    const existing = await this.articlesRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Artikel tidak ditemukan' };
    }

    return await this.articlesRepository.update(id, data);
  }

  async togglePublishStatus(id: number, status?: 'Dipublikasikan' | 'Draft') {
    const existing = await this.articlesRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Artikel tidak ditemukan' };
    }

    const nextStatus = status || (existing.status === 'Dipublikasikan' ? 'Draft' : 'Dipublikasikan');
    return await this.articlesRepository.update(id, { status: nextStatus });
  }

  async deleteArticle(id: number) {
    const existing = await this.articlesRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Artikel tidak ditemukan' };
    }

    await this.articlesRepository.delete(id);
    return true;
  }
}
