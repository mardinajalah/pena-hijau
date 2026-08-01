import { db } from '../../config/firebase';

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
  private collection = db.collection('articles');
  private inMemoryStore: ArticleDocument[] = [
    {
      id: 1,
      title: 'Aksi Clean-Up Aliran Sungai & Pengelolaan Limbah Plastik',
      category: 'Pilar Clean-Up',
      date: '27 Juli 2026',
      location: 'Sungai Kotaanyar, Probolinggo',
      author: 'Tim Pena Hijau',
      excerpt: 'Pena Hijau menginisiasi pembersihan sungai secara intensif guna mencegah banjir dan mengedukasi warga tentang bahaya pembuangan sampah ke sungai.',
      paragraphs: [
        'Giat pembersihan sungai ini melibatkan puluhan relawan lokal dan masyarakat sekitarnya. Limbah plastik dan material sampah rumah tangga dipilah secara sistematis.',
        'Melalui gerakan ini, Pena Hijau berkomitmen menciptakan sungai yang bersih, aman, dan memicu kesadaran kolektif akan pelestarian lingkungan air.'
      ],
      quote: 'Sungai bukan tempat pembuangan akhir, melainkan sumber kehidupan yang wajib kita jaga bersama.',
      image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      galleryImages: [
        '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
        '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp',
        '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp'
      ],
      sources: [
        { name: 'Pantura News', url: 'https://example.com' }
      ],
      status: 'Dipublikasikan',
      createdAt: '2026-07-27T10:00:00.000Z'
    },
    {
      id: 2,
      title: 'Gerakan Reboisasi & Penghijauan Lahan Kritis',
      category: 'Pilar Penghijauan',
      date: '15 Juli 2026',
      location: 'Kecamatan Paiton, Probolinggo',
      author: 'Divisi Penghijauan',
      excerpt: 'Program penanaman bibit pohon lindung dan produktif di titik-titik rawan longsor serta daerah resapan air.',
      paragraphs: [
        'Penanaman pohon ini merupakan bagian dari pilar ekologis jangka panjang Pena Hijau untuk meningkatkan daerah resapan air dan daya dukung lingkungan.',
        'Bibit yang ditanam mencakup pohon buah-buahan lokal dan pohon keras yang bermanfaat bagi generasi mendatang.'
      ],
      quote: 'Satu pohon yang kita tanam hari ini adalah oksigen bagi anak cucu kita besok.',
      image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      galleryImages: [
        '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
        '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp'
      ],
      sources: [
        { name: 'Kabar Hijau', url: 'https://example.com' }
      ],
      status: 'Dipublikasikan',
      createdAt: '2026-07-15T10:00:00.000Z'
    },
    {
      id: 3,
      title: 'Edukasi Lingkungan & Pemberdayaan Komunitas',
      category: 'Pilar Edukasi',
      date: '02 Juni 2026',
      location: 'Kabupaten Probolinggo',
      author: 'Divisi Edukasi & Publikasi',
      excerpt: 'Memberikan pemahaman praktis mengenai pemilahan sampah organik & anorganik serta pengolahan kompos skala rumah tangga.',
      paragraphs: [
        'Pena Hijau menggelar workshop edukasi dan pendampingan pengelolaan sampah organik secara langsung kepada ibu-ibu dan pemuda desa.',
        'Dengan terbukanya wawasan mengenai nilai guna daur ulang sampah, diharapkan pembuangan sampah sembarangan dapat diminimalisir.'
      ],
      quote: 'Edukasi adalah kunci utama perubahan perilaku ramah lingkungan secara berkelanjutan.',
      image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
      galleryImages: [
        '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
        '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp'
      ],
      sources: [
        { name: 'Warta Eco', url: 'https://example.com' }
      ],
      status: 'Dipublikasikan',
      createdAt: '2026-06-02T10:00:00.000Z'
    }
  ];

  async findAll(): Promise<ArticleDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return [];
      return snapshot.docs.map((doc: any) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as ArticleDocument));
    } catch (error) {
      return this.inMemoryStore;
    }
  }

  async findById(id: number): Promise<ArticleDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) {
        return this.inMemoryStore.find((a) => a.id === id) || null;
      }
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
    const updatePayload = { ...data, updatedAt: new Date().toISOString() };
    try {
      await this.collection.doc(String(id)).update(updatePayload);
    } catch (error) {
      // Fallback
    }

    const index = this.inMemoryStore.findIndex((a) => a.id === id);
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
    this.inMemoryStore = this.inMemoryStore.filter((a) => a.id !== id);
    return true;
  }
}
