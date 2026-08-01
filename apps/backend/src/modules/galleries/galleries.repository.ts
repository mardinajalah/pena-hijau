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
  private inMemoryStore: GalleryDocument[] = [];

  async findAll(): Promise<GalleryDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return [];
      return snapshot.docs.map((doc: any) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as GalleryDocument));
    } catch (error) {
      return this.inMemoryStore;
    }
  }

  async findById(id: number): Promise<GalleryDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) {
        return this.inMemoryStore.find((g) => g.id === id) || null;
      }
      return { id: Number(doc.id), ...doc.data() } as GalleryDocument;
    } catch (error) {
      return this.inMemoryStore.find((g) => g.id === id) || null;
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

    try {
      await this.collection.doc(String(newId)).set(newGallery);
    } catch (error) {
      // Fallback
    }

    this.inMemoryStore.unshift(newGallery);
    return newGallery;
  }

  async update(id: number, data: Partial<GalleryDocument>): Promise<GalleryDocument | null> {
    const updatePayload = { ...data, updatedAt: new Date().toISOString() };
    try {
      await this.collection.doc(String(id)).update(updatePayload);
    } catch (error) {
      // Fallback
    }

    const index = this.inMemoryStore.findIndex((g) => g.id === id);
    if (index !== -1) {
      this.inMemoryStore[index] = { ...this.inMemoryStore[index], ...updatePayload };
      return this.inMemoryStore[index];
    }
    return null;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.collection.doc(String(id)).delete();
    } catch (error) {
      // Fallback
    }
    this.inMemoryStore = this.inMemoryStore.filter((g) => g.id !== id);
    return true;
  }
}
