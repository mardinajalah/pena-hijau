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

const initialJoinRequests: JoinRequestDocument[] = [
  {
    id: 1,
    name: 'Rizky Firmansyah',
    address: 'Jl. Merpati No. 4, Kec. Kotaanyar',
    domicile: 'Probolinggo, Jawa Timur',
    divisionInterest: 'Koordinator Lapangan & Clean-Up',
    whatsapp: '082211223344',
    motto: 'Sungai bersih dimulai dari tangan kita sendiri.',
    registeredDate: '2026-08-01T00:00:00.000Z',
    status: 'Menunggu',
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Nur Aini Rahayu',
    address: 'Jl. Bougenville No. 8, Kec. Kraksaan',
    domicile: 'Probolinggo, Jawa Timur',
    divisionInterest: 'Tim Edukasi & Bank Sampah',
    whatsapp: '085599887766',
    motto: 'Ilmu tanpa aksi adalah sia-sia.',
    registeredDate: '2026-07-31T00:00:00.000Z',
    status: 'Menunggu',
    createdAt: '2026-07-31T15:00:00.000Z',
  },
  {
    id: 3,
    name: 'Hendra Prasetyo',
    address: 'Jl. Mawar No. 17, Desa Paiton',
    domicile: 'Probolinggo, Jawa Timur',
    divisionInterest: 'Penghijauan & Bibit Pohon',
    whatsapp: '081345678901',
    motto: 'Menanam satu pohon berarti menitipkan oksigen.',
    registeredDate: '2026-07-30T00:00:00.000Z',
    status: 'Diterima',
    createdAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: 4,
    name: 'Ayu Setyowati',
    address: 'Jl. Cempaka No. 2, Desa Pesisir Hijau',
    domicile: 'Situbondo, Jawa Timur',
    divisionInterest: 'Media & Kampanye Digital',
    whatsapp: '089900112233',
    motto: 'Satu video viral bisa mengubah cara pandang.',
    registeredDate: '2026-07-29T00:00:00.000Z',
    status: 'Menunggu',
    createdAt: '2026-07-29T10:00:00.000Z',
  },
  {
    id: 5,
    name: 'Bagas Kurniawan',
    address: 'Jl. Rambutan No. 11, Kec. Paiton',
    domicile: 'Probolinggo, Jawa Timur',
    divisionInterest: 'Logistik & Operasional',
    whatsapp: '083366778899',
    motto: 'Di balik aksi besar, ada tim support.',
    registeredDate: '2026-07-28T00:00:00.000Z',
    status: 'Ditolak',
    createdAt: '2026-07-28T10:00:00.000Z',
  },
];

export class JoinRequestsRepository {
  private collection = db.collection('join_requests');
  private inMemoryStore: JoinRequestDocument[] = [...initialJoinRequests];

  async findAll(): Promise<JoinRequestDocument[]> {
    try {
      const snapshot = await this.collection.get();
      if (snapshot.empty) return this.inMemoryStore;
      return snapshot.docs.map((doc) => ({ id: Number(doc.id) || doc.data().id, ...doc.data() } as JoinRequestDocument));
    } catch (error) {
      return this.inMemoryStore;
    }
  }

  async findById(id: number): Promise<JoinRequestDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) return this.inMemoryStore.find((r) => r.id === id) || null;
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
      // Fallback
    }

    this.inMemoryStore.unshift(newRequest);
    return newRequest;
  }

  async updateStatus(id: number, status: RequestStatus, adminNote?: string): Promise<JoinRequestDocument | null> {
    const verifiedAt = new Date().toISOString();
    const updatedData = { status, adminNote, verifiedAt };

    try {
      await this.collection.doc(String(id)).set(updatedData, { merge: true });
    } catch (error) {
      // Fallback
    }

    const idx = this.inMemoryStore.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.inMemoryStore[idx] = { ...this.inMemoryStore[idx], ...updatedData };
      return this.inMemoryStore[idx];
    }
    return null;
  }
}
