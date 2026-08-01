import { db } from '../../config/firebase';

export interface MemberDocument {
  id: number;
  name: string;
  address: string;
  domicile: string;
  division: string;
  whatsapp: string;
  motto: string;
  status: 'Aktif' | 'Nonaktif';
  joinDate: string;
  avatar: string;
  createdAt: string;
  updatedAt?: string;
}

export class MembersRepository {
  private collection = db.collection('members');
  private inMemoryStore: MemberDocument[] = [];

  async findAll(): Promise<MemberDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return [];
      return snapshot.docs.map((doc: any) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as MemberDocument));
    } catch (error) {
      return this.inMemoryStore;
    }
  }

  async findById(id: number): Promise<MemberDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) {
        return this.inMemoryStore.find((m) => m.id === id) || null;
      }
      return { id: Number(doc.id), ...doc.data() } as MemberDocument;
    } catch (error) {
      return this.inMemoryStore.find((m) => m.id === id) || null;
    }
  }

  async create(data: Omit<MemberDocument, 'id' | 'createdAt'>): Promise<MemberDocument> {
    const newId = Date.now();
    const newMember: MemberDocument = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      await this.collection.doc(String(newId)).set(newMember);
    } catch (error) {
      // In-memory fallback
    }

    this.inMemoryStore.unshift(newMember);
    return newMember;
  }

  async update(id: number, data: Partial<MemberDocument>): Promise<MemberDocument | null> {
    const updatePayload = { ...data, updatedAt: new Date().toISOString() };
    try {
      await this.collection.doc(String(id)).update(updatePayload);
    } catch (error) {
      // Fallback
    }

    const index = this.inMemoryStore.findIndex((m) => m.id === id);
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
    this.inMemoryStore = this.inMemoryStore.filter((m) => m.id !== id);
    return true;
  }
}
