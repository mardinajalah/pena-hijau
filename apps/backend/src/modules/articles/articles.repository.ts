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
  private inMemoryStore: ArticleDocument[] = [];

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
