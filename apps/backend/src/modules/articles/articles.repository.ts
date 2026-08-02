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

  async findAll(): Promise<ArticleDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) {
        return [];
      }
      return snapshot.docs.map((doc: any) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as ArticleDocument));
    } catch (error) {
      console.error('[ArticlesRepository] findAll error:', error);
      return [];
    }
  }

  async findById(id: number): Promise<ArticleDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) {
        return null;
      }
      return { id: Number(doc.id), ...doc.data() } as ArticleDocument;
    } catch (error) {
      console.error('[ArticlesRepository] findById error:', error);
      return null;
    }
  }

  async create(data: Omit<ArticleDocument, 'id' | 'createdAt'>): Promise<ArticleDocument> {
    const newId = Date.now();
    const newArticle: ArticleDocument = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    await this.collection.doc(String(newId)).set(newArticle);
    return newArticle;
  }

  async update(id: number, data: Partial<ArticleDocument>): Promise<ArticleDocument | null> {
    const updatePayload = { ...data, updatedAt: new Date().toISOString() };
    await this.collection.doc(String(id)).update(updatePayload);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    await this.collection.doc(String(id)).delete();
    return true;
  }
}
