import { db } from '../../config/firebase';

export interface ArticleSource {
  name: string;
  url: string;
}

export interface ArticleDocument {
  id: number;
  title: string;
  category: 'Aksi Clean-Up' | 'Penghijauan' | 'Edukasi' | 'Komunitas';
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

const initialArticles: ArticleDocument[] = [
  {
    id: 1,
    title: 'Peduli Lingkungan, Komunitas PENA HIJAU Gelar Aksi Clean Up River di Kotaanyar Probolinggo',
    category: 'Aksi Clean-Up',
    date: '27 Juli 2026',
    location: 'Kecamatan Kotaanyar, Kabupaten Probolinggo',
    author: 'Taufiqur Rohim (Koordinator PENA HIJAU)',
    excerpt: 'Kelompok pemuda Komunitas PENA HIJAU menggelar aksi bersih-bersih sungai di Kotaanyar Probolinggo sebagai langkah konkrit mencegah pencemaran dan bencana banjir.',
    paragraphs: [
      'PROBOLINGGO — Kelompok pemuda yang tergabung dalam Komunitas Pemuda Nusantara Peduli Lingkungan Hijau (PENA HIJAU) menggelar aksi clean up river (bersih-bersih sungai) di wilayah Kecamatan Kotaanyar, Kabupaten Probolinggo, Senin sore (27/07/2026).',
      'Aksi tanggap lingkungan ini dilakukan sebagai bentuk kepedulian nyata para generasi muda terhadap kondisi sungai yang kian tertutup tumpukan sampah plastik, limbah rumah tangga, dan kotoran liar yang mengganggu kelancaran aliran air.',
      'Dengan menggunakan peralatan lengkap seperti karung sampah, sepatu boots, dan sarung tangan, para relawan muda Pena Hijau secara langsung menyusuri dan mengangkat berbagai material sampah dari dasar serta pinggiran sungai.',
      'Langkah ini diharapkan tidak hanya dapat mengembalikan kebersihan dan kelancaran fungsi aliran sungai Kotaanyar, melainkan juga mengedukasi dan menggugah kesadaran masyarakat sekitar agar menghentikan kebiasaan membuang sampah sembarangan ke sungai.',
    ],
    quote: 'Kami melihat tumpukan sampah di aliran sungai ini sudah sangat mengkhawatirkan. Jika dibiarkan, saat musim hujan bisa memicu banjir dan pencemaran air.',
    image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
    galleryImages: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
    ],
    sources: [
      { name: 'Berdampak.net', url: 'https://berdampak.net/peduli-lingkungan-komunitas-pena-hijau-gelar-aksi-clean-up-river-di-kotaanyar-probolinggo/' },
      { name: 'HarianJatim.com', url: 'https://www.harianjatim.com/2026/07/27/aksi-nyata-komunitas-pena-hijau-bersihkan-tumpukan-sampah-di-sungai-kotaanyar-probolinggo/' },
    ],
    status: 'Dipublikasikan',
    createdAt: '2026-07-27T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Tanam 500 Bibit Pohon Produktif, Pena Hijau Hijaukan Lereng Desa Paiton',
    category: 'Penghijauan',
    date: '15 Juli 2026',
    location: 'Kecamatan Paiton, Kabupaten Probolinggo',
    author: 'Budi Santoso',
    excerpt: 'Relawan Pena Hijau bersama petani desa menanam 500 bibit pohon buah dan pohon lindung.',
    paragraphs: [
      'PROBOLINGGO — Ratusan relawan muda Komunitas Pena Hijau turun gunung ke Kecamatan Paiton untuk menggelar aksi penanaman massal 500 bibit pohon produktif dan pohon lindung.',
    ],
    image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
    sources: [],
    status: 'Dipublikasikan',
    createdAt: '2026-07-15T10:00:00.000Z',
  },
];

export class ArticlesRepository {
  private collection = db.collection('articles');
  private inMemoryStore: ArticleDocument[] = [...initialArticles];

  async findAll(): Promise<ArticleDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return this.inMemoryStore;
      return snapshot.docs.map((doc) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as ArticleDocument));
    } catch (error) {
      return this.inMemoryStore;
    }
  }

  async findById(id: number): Promise<ArticleDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) return this.inMemoryStore.find((a) => a.id === id) || null;
      return { id: Number(doc.id), ...doc.data() } as ArticleDocument;
    } catch (error) {
      return this.inMemoryStore.find((a) => a.id === id) || null;
    }
  }

  async create(data: Omit<ArticleDocument, 'id' | 'createdAt'>): Promise<ArticleDocument> {
    const newId = Date.now();
    const newArticle: ArticleDocument = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      await this.collection.doc(String(newId)).set(newArticle);
    } catch (error) {
      // Fallback
    }

    this.inMemoryStore.unshift(newArticle);
    return newArticle;
  }

  async update(id: number, data: Partial<ArticleDocument>): Promise<ArticleDocument | null> {
    const updatedAt = new Date().toISOString();
    const updatedData = { ...data, updatedAt };

    try {
      await this.collection.doc(String(id)).set(updatedData, { merge: true });
    } catch (error) {
      // Fallback
    }

    const idx = this.inMemoryStore.findIndex((a) => a.id === id);
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

    const idx = this.inMemoryStore.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.inMemoryStore.splice(idx, 1);
      return true;
    }
    return false;
  }
}
