import { db } from '../../config/firebase';

export type RequestStatus = 'Menunggu' | 'Diterima' | 'Ditolak';

export interface JoinRequestDocument {
  id: number;
  name: string;
  address: string;
  domicile: string;
  divisionInterest: string;
  whatsapp: string;
  motto: string;
  registeredDate: string;
  status: RequestStatus;
  adminNote?: string;
  createdAt: string;
  verifiedAt?: string;
}

export class JoinRequestsRepository {
  private collection = db.collection('join_requests');
  private inMemoryStore: JoinRequestDocument[] = [];

  async findAll(): Promise<JoinRequestDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return [];
      return snapshot.docs.map((doc: any) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as JoinRequestDocument));
    } catch (error) {
      return this.inMemoryStore;
    }
  }

  async findById(id: number): Promise<JoinRequestDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) {
        return this.inMemoryStore.find((r) => r.id === id) || null;
      }
      return { id: Number(doc.id), ...doc.data() } as JoinRequestDocument;
    } catch (error) {
      return this.inMemoryStore.find((r) => r.id === id) || null;
    }
  }

  async create(data: Omit<JoinRequestDocument, 'id' | 'createdAt'>): Promise<JoinRequestDocument> {
    const newId = Date.now();
    const newRequest: JoinRequestDocument = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      await this.collection.doc(String(newId)).set(newRequest);
    } catch (error) {
      // In-memory fallback
    }

    this.inMemoryStore.unshift(newRequest);
    return newRequest;
  }

  async updateStatus(id: number, status: RequestStatus, adminNote?: string): Promise<JoinRequestDocument | null> {
    const now = new Date().toISOString();
    const updatePayload: Partial<JoinRequestDocument> = { status, verifiedAt: now };
    if (adminNote) updatePayload.adminNote = adminNote;

    try {
      await this.collection.doc(String(id)).update(updatePayload);
    } catch (error) {
      // Fallback
    }

    const index = this.inMemoryStore.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.inMemoryStore[index] = { ...this.inMemoryStore[index], ...updatePayload };
      return this.inMemoryStore[index];
    }

    const doc = await this.findById(id);
    return doc ? { ...doc, ...updatePayload } : null;
  }
}
