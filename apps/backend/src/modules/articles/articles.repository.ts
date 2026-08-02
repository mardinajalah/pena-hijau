import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { articles } from '../../db/schema';

export interface ArticleSource {
  name: string;
  url: string;
}

export interface ArticleDocument {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  author: string;
  excerpt: string;
  paragraphs: string[];
  quote?: string;
  image: string;
  galleryImages?: string[];
  sources: ArticleSource[];
  status: 'Dipublikasikan' | 'Draft';
  createdAt: string;
  updatedAt?: string;
}

export class ArticlesRepository {
  async findAll(): Promise<ArticleDocument[]> {
    try {
      const rows = await db.select().from(articles);
      return rows.map(this.mapRow);
    } catch (error) {
      console.error('[ArticlesRepository] findAll error:', error);
      return [];
    }
  }

  async findById(id: number): Promise<ArticleDocument | null> {
    try {
      const rows = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
      if (rows.length === 0) return null;
      return this.mapRow(rows[0]);
    } catch (error) {
      console.error('[ArticlesRepository] findById error:', error);
      return null;
    }
  }

  async create(data: Omit<ArticleDocument, 'id' | 'createdAt'>): Promise<ArticleDocument> {
    const now = new Date();
    await db.insert(articles).values({
      title: data.title,
      category: data.category,
      date: data.date,
      location: data.location,
      author: data.author,
      excerpt: data.excerpt,
      paragraphs: data.paragraphs,
      quote: data.quote,
      image: data.image,
      galleryImages: data.galleryImages,
      sources: data.sources,
      status: data.status,
      createdAt: now,
    });

    const rows = await db
      .select()
      .from(articles)
      .orderBy(articles.id)
      .limit(1);

    // Get the last inserted row
    const allRows = await db.select().from(articles);
    const lastRow = allRows[allRows.length - 1];
    return this.mapRow(lastRow);
  }

  async update(id: number, data: Partial<ArticleDocument>): Promise<ArticleDocument | null> {
    const updatePayload: Record<string, any> = { updatedAt: new Date() };
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.date !== undefined) updatePayload.date = data.date;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.author !== undefined) updatePayload.author = data.author;
    if (data.excerpt !== undefined) updatePayload.excerpt = data.excerpt;
    if (data.paragraphs !== undefined) updatePayload.paragraphs = data.paragraphs;
    if (data.quote !== undefined) updatePayload.quote = data.quote;
    if (data.image !== undefined) updatePayload.image = data.image;
    if (data.galleryImages !== undefined) updatePayload.galleryImages = data.galleryImages;
    if (data.sources !== undefined) updatePayload.sources = data.sources;
    if (data.status !== undefined) updatePayload.status = data.status;

    await db.update(articles).set(updatePayload).where(eq(articles.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    await db.delete(articles).where(eq(articles.id, id));
    return true;
  }

  private mapRow(row: typeof articles.$inferSelect): ArticleDocument {
    return {
      id: row.id,
      title: row.title ?? '',
      category: row.category ?? '',
      date: row.date ?? '',
      location: row.location ?? '',
      author: row.author ?? '',
      excerpt: row.excerpt ?? '',
      paragraphs: (row.paragraphs as string[]) ?? [],
      quote: row.quote ?? undefined,
      image: row.image ?? '',
      galleryImages: (row.galleryImages as string[]) ?? [],
      sources: (row.sources as ArticleSource[]) ?? [],
      status: (row.status as 'Dipublikasikan' | 'Draft') ?? 'Draft',
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? undefined,
    };
  }
}
