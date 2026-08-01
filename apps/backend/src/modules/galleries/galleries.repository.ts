import { db } from '../../config/firebase';

export interface PhotoItem {
  id: number;
  url: string;
  caption?: string;
}

export interface GalleryDocument {
  id: number;
  title: string;
  category: 'Aksi Clean-Up' | 'Penghijauan' | 'Edukasi' | 'Komunitas';
  location: string;
  date: string;
  coverImage: string;
  description: string;
  photoCount: number;
  photos: PhotoItem[];
  createdAt: string;
  updatedAt?: string;
}

const initialGalleries: GalleryDocument[] = [
  {
    id: 1,
    title: 'Aksi Bersih Sampah Aliran Sungai Kotaanyar',
    category: 'Aksi Clean-Up',
    location: 'Desa Kotaanyar, Probolinggo',
    date: '27 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
    description: 'Relawan Pena Hijau bersama warga bergotong-royong membersihkan limbah plastik di jembatan sungai Kotaanyar.',
    photoCount: 7,
    photos: [
      { id: 101, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp', caption: 'Persiapan tim relawan' },
      { id: 102, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp', caption: 'Pembersihan sampah plastik' },
      { id: 103, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp', caption: 'Pengangkutan sampah ke truk' },
      { id: 104, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp', caption: 'Gotong royong relawan di bawah jembatan' },
      { id: 105, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp', caption: 'Kondisi aliran air sungai' },
      { id: 106, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp', caption: 'Foto bersama relawan' },
      { id: 107, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp', caption: 'Edukasi singkat warga' },
    ],
    createdAt: '2026-07-27T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Penanaman 500 Bibit Pohon Produktif',
    category: 'Penghijauan',
    location: 'Kecamatan Paiton, Probolinggo',
    date: '15 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
    description: 'Aksi hijau menanam bibit pohon buah dan lindung di kawasan lereng kritis.',
    photoCount: 2,
    photos: [
      { id: 201, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp' },
      { id: 202, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp' },
    ],
    createdAt: '2026-07-15T10:00:00.000Z',
  },
];

export class GalleriesRepository {
  private collection = db.collection('galleries');
  private inMemoryStore: GalleryDocument[] = [...initialGalleries];

  async findAll(): Promise<GalleryDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return this.inMemoryStore;
      return snapshot.docs.map((doc: any) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as GalleryDocument));
    } catch (error) {
      return this.inMemoryStore;
    }
  }

  async findById(id: number): Promise<GalleryDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) return this.inMemoryStore.find((g) => g.id === id) || null;
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
    const updatedAt = new Date().toISOString();
    const updatedData = { ...data, updatedAt };

    try {
      await this.collection.doc(String(id)).set(updatedData, { merge: true });
    } catch (error) {
      // Fallback
    }

    const idx = this.inMemoryStore.findIndex((g) => g.id === id);
    if (idx !== -1) {
      this.inMemoryStore[idx] = { ...this.inMemoryStore[idx], ...updatedData };
      return this.inMemoryStore[idx];
    }
    return null;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.collection.doc(String(id)).delete();
    } catch (error) {
      // Fallback
    }

    const idx = this.inMemoryStore.findIndex((g) => g.id === id);
    if (idx !== -1) {
      this.inMemoryStore.splice(idx, 1);
      return true;
    }
    return false;
  }
}
