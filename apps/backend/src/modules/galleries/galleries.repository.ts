import { db } from '../../config/firebase';

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
  private collection = db.collection('galleries');

  async findAll(): Promise<GalleryDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map(
        (doc: any) =>
          ({
            id: Number(doc.id) || doc.data().id,
            ...doc.data(),
          }) as GalleryDocument,
      );
    } catch (error) {
      console.error('[GalleriesRepository] findAll error:', error);
      return [];
    }
  }

  async findById(id: number): Promise<GalleryDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) {
        return null;
      }
      return { id: Number(doc.id), ...doc.data() } as GalleryDocument;
    } catch (error) {
      console.error('[GalleriesRepository] findById error:', error);
      return null;
    }
  }

  async create(data: Omit<GalleryDocument, 'id' | 'createdAt'>): Promise<GalleryDocument> {
    const newId = Date.now();
    const newGallery: GalleryDocument = {
      id: newId,
      ...data,
      photoCount: data.photos ? data.photos.length : 0,
      createdAt: new Date().toISOString(),
    };

    await this.collection.doc(String(newId)).set(newGallery);
    return newGallery;
  }

  async update(id: number, data: Partial<GalleryDocument>): Promise<GalleryDocument | null> {
    const updatePayload = { ...data, updatedAt: new Date().toISOString() };
    await this.collection.doc(String(id)).update(updatePayload);

    const updated = await this.findById(id);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    await this.collection.doc(String(id)).delete();
    return true;
  }
}
