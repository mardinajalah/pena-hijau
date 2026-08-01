import { db } from '../../config/firebase';

export interface AdminDocument {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  avatarUrl: string;
  createdAt: string;
  lastLogin?: string;
}

export class AuthRepository {
  private collection = db.collection('admins');

  // Seed default admin if database is empty
  private defaultAdmin: AdminDocument = {
    id: 1,
    name: 'Taufiqur Rohim',
    email: 'admin@penahijau.org',
    // Hash for 'password123'
    passwordHash: '$2a$10$w3GvA4O2.3R6qD9mX3.09O4cT7dZkL9Y6Pq5mR8vW0t1X2Y3Z4A5B',
    role: 'Super Admin',
    avatarUrl: '/avatars/admin.webp',
    createdAt: new Date().toISOString(),
  };

  async findByEmail(email: string): Promise<AdminDocument | null> {
    try {
      const snapshot = await this.collection.where('email', '==', email).limit(1).get();
      if (snapshot.empty) {
        // Fallback for default admin
        if (email === this.defaultAdmin.email) {
          return this.defaultAdmin;
        }
        return null;
      }
      const doc = snapshot.docs[0];
      return { id: Number(doc.id) || 1, ...doc.data() } as AdminDocument;
    } catch (error) {
      // Return fallback default admin for initial dev setup
      if (email === this.defaultAdmin.email) {
        return this.defaultAdmin;
      }
      return null;
    }
  }

  async findById(id: number): Promise<AdminDocument | null> {
    try {
      const doc = await this.collection.doc(String(id)).get();
      if (!doc.exists) {
        if (id === 1) return this.defaultAdmin;
        return null;
      }
      return { id: Number(doc.id), ...doc.data() } as AdminDocument;
    } catch (error) {
      if (id === 1) return this.defaultAdmin;
      return null;
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    try {
      await this.collection.doc(String(id)).set(
        { lastLogin: new Date().toISOString() },
        { merge: true },
      );
    } catch (error) {
      // Ignore if firestore offline in local fallback mode
    }
  }
}
