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
  private inMemoryStore: GalleryDocument[] = [
    {
      id: 1,
      title: 'Aksi Bersih Sampah Aliran Sungai Kotaanyar',
      category: 'Aksi Clean-Up',
      location: 'Desa Kotaanyar, Probolinggo',
      date: '27 Juli 2026',
      coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      photoCount: 7,
      description: 'Relawan Pena Hijau bersama warga bergotong-royong membersihkan limbah plastik di jembatan sungai Kotaanyar.',
      photos: [
        { id: 101, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp', caption: 'Persiapan tim relawan di tepi sungai' },
        { id: 102, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp', caption: 'Pembersihan material sampah plastik' },
        { id: 103, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp', caption: 'Pengangkutan sampah ke truk angkut' },
        { id: 104, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp', caption: 'Gotong royong relawan muda di bawah jembatan' },
        { id: 105, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp', caption: 'Kondisi aliran air sungai setelah dibersihkan' },
        { id: 106, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp', caption: 'Foto bersama relawan Pena Hijau' },
        { id: 107, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp', caption: 'Edukasi singkat kepada warga sekitar' }
      ],
      createdAt: '2026-07-27T10:00:00.000Z'
    },
    {
      id: 2,
      title: 'Penanaman 500 Bibit Pohon Produktif',
      category: 'Penghijauan',
      location: 'Kecamatan Paiton, Probolinggo',
      date: '15 Juli 2026',
      coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      photoCount: 3,
      description: 'Aksi hijau menanam bibit pohon buah dan lindung di kawasan lereng kritis desa mitra.',
      photos: [
        { id: 201, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp', caption: 'Penanaman bibit pohon bersama pemuda karang taruna' },
        { id: 202, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp', caption: 'Penyiraman dan perawatan bibit hijau' },
        { id: 203, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp', caption: 'Penyerahan bantuan bibit tanaman' }
      ],
      createdAt: '2026-07-15T10:00:00.000Z'
    },
    {
      id: 3,
      title: 'Edukasi Kelola Sampah Rumah Tangga & Komposting',
      category: 'Edukasi',
      location: 'Desa Karanganyar, Probolinggo',
      date: '02 Juni 2026',
      coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
      photoCount: 2,
      description: 'Pelatihan pemilahan sampah organik dan anorganik dari dapur rumah tangga untuk dijadikan pupuk kompos.',
      photos: [
        { id: 301, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp', caption: 'Sesi sosialisasi dan pemutaran modul edukasi' },
        { id: 302, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp', caption: 'Praktek pemilahan sampah bersama warga' }
      ],
      createdAt: '2026-06-02T10:00:00.000Z'
    }
  ];

  async findAll(): Promise<GalleryDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) {
        for (const item of this.inMemoryStore) {
          await this.collection.doc(String(item.id)).set(item).catch(() => {});
        }
        return this.inMemoryStore;
      }
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
