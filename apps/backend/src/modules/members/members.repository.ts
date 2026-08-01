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

const initialMembers: MemberDocument[] = [
  {
    id: 1,
    name: 'Ahmad Hidayat, S.P.',
    address: 'Jl. Melati No. 12, Desa Kotaanyar',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Koordinator Lapangan & Clean-Up',
    whatsapp: '082233441122',
    motto: 'Alam yang sehat adalah warisan terbaik untuk generasi mendatang.',
    status: 'Aktif',
    joinDate: '2024-03-12T00:00:00.000Z',
    avatar: 'AH',
    createdAt: '2024-03-12T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    address: 'Jl. Anggrek No. 5, Kec. Kraksaan',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Tim Edukasi & Bank Sampah',
    whatsapp: '085678901234',
    motto: 'Edukasi adalah kunci perubahan lingkungan yang berkelanjutan.',
    status: 'Aktif',
    joinDate: '2024-06-28T00:00:00.000Z',
    avatar: 'SN',
    createdAt: '2024-06-28T10:00:00.000Z',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    address: 'Jl. Kenanga No. 7, Desa Pesisir Hijau',
    domicile: 'Situbondo, Jawa Timur',
    division: 'Penghijauan & Bibit Pohon',
    whatsapp: '081234567890',
    motto: 'Setiap pohon yang kita tanam hari ini adalah nafas anak cucu esok hari.',
    status: 'Aktif',
    joinDate: '2025-01-05T00:00:00.000Z',
    avatar: 'BS',
    createdAt: '2025-01-05T10:00:00.000Z',
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    address: 'Jl. Flamboyan No. 3, Kec. Kotaanyar',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Media & Kampanye Digital',
    whatsapp: '089876543210',
    motto: 'Satu konten viral bisa menggerakkan ribuan tangan untuk alam.',
    status: 'Aktif',
    joinDate: '2024-08-17T00:00:00.000Z',
    avatar: 'DL',
    createdAt: '2024-08-17T10:00:00.000Z',
  },
  {
    id: 5,
    name: 'Rahmat Ramadhan',
    address: 'Jl. Padi No. 21, Kec. Paiton',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Koordinator Lapangan & Clean-Up',
    whatsapp: '083344556677',
    motto: 'Turun ke lapangan adalah bentuk cinta paling nyata pada lingkungan.',
    status: 'Nonaktif',
    joinDate: '2024-02-03T00:00:00.000Z',
    avatar: 'RR',
    createdAt: '2024-02-03T10:00:00.000Z',
  },
];

export class MembersRepository {
  private collection = db.collection('members');
  private inMemoryStore: MemberDocument[] = [...initialMembers];

  async findAll(): Promise<MemberDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return this.inMemoryStore;
      return snapshot.docs.map((doc) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as MemberDocument));
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
    const updatedAt = new Date().toISOString();
    const updatedData = { ...data, updatedAt };

    try {
      await this.collection.doc(String(id)).set(updatedData, { merge: true });
    } catch (error) {
      // Fallback
    }

    const idx = this.inMemoryStore.findIndex((m) => m.id === id);
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

    const idx = this.inMemoryStore.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.inMemoryStore.splice(idx, 1);
      return true;
    }
    return false;
  }
}
