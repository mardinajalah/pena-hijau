import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { galleries } from '../../db/schema';

export interface PhotoItem {
  id: number;
  url: string;
  caption?: string;
}

export interface GalleryDocument {
  id: number;
  title: string;
  category: 'Penghijauan' | 'Aksi Clean-Up' | 'Edukasi' | 'Komunitas';
  location: string;
  date: string;
  coverImage: string;
  photos: PhotoItem[];
  photoCount?: number;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export class GalleriesRepository {
  async findAll(): Promise<GalleryDocument[]> {
    try {
      const rows = await db.select().from(galleries);
      return rows.map(this.mapRow);
    } catch (error) {
      console.error('[GalleriesRepository] findAll error:', error);
      return [];
    }
  }

  async findById(id: number): Promise<GalleryDocument | null> {
    try {
      const rows = await db.select().from(galleries).where(eq(galleries.id, id)).limit(1);
      if (rows.length === 0) return null;
      return this.mapRow(rows[0]);
    } catch (error) {
      console.error('[GalleriesRepository] findById error:', error);
      return null;
    }
  }

  async create(data: Omit<GalleryDocument, 'id' | 'createdAt'>): Promise<GalleryDocument> {
    const now = new Date();
    await db.insert(galleries).values({
      title: data.title,
      category: data.category,
      location: data.location,
      date: data.date,
      coverImage: data.coverImage,
      photos: data.photos,
      photoCount: data.photos ? data.photos.length : 0,
      description: data.description,
      createdAt: now,
    });

    const allRows = await db.select().from(galleries);
    const lastRow = allRows[allRows.length - 1];
    return this.mapRow(lastRow);
  }

  async update(id: number, data: Partial<GalleryDocument>): Promise<GalleryDocument | null> {
    const updatePayload: Record<string, any> = { updatedAt: new Date() };
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.location !== undefined) updatePayload.location = data.location;
    if (data.date !== undefined) updatePayload.date = data.date;
    if (data.coverImage !== undefined) updatePayload.coverImage = data.coverImage;
    if (data.photos !== undefined) {
      updatePayload.photos = data.photos;
      updatePayload.photoCount = data.photos.length;
    }
    if (data.description !== undefined) updatePayload.description = data.description;

    await db.update(galleries).set(updatePayload).where(eq(galleries.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    await db.delete(galleries).where(eq(galleries.id, id));
    return true;
  }

  private mapRow(row: typeof galleries.$inferSelect): GalleryDocument {
    return {
      id: row.id,
      title: row.title ?? '',
      category: (row.category as GalleryDocument['category']) ?? 'Komunitas',
      location: row.location ?? '',
      date: row.date ?? '',
      coverImage: row.coverImage ?? '',
      photos: (row.photos as PhotoItem[]) ?? [],
      photoCount: row.photoCount ?? 0,
      description: row.description ?? '',
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? undefined,
    };
  }
}
