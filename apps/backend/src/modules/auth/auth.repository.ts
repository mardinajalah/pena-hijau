import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { admins } from '../../db/schema';

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
  async findByEmail(email: string): Promise<AdminDocument | null> {
    try {
      const rows = await db
        .select()
        .from(admins)
        .where(eq(admins.email, email))
        .limit(1);
      if (rows.length === 0) return null;
      return this.mapRow(rows[0]);
    } catch (error) {
      console.error('[AuthRepository] findByEmail error:', error);
      return null;
    }
  }

  async findById(id: number): Promise<AdminDocument | null> {
    try {
      const rows = await db
        .select()
        .from(admins)
        .where(eq(admins.id, id))
        .limit(1);
      if (rows.length === 0) return null;
      return this.mapRow(rows[0]);
    } catch (error) {
      console.error('[AuthRepository] findById error:', error);
      return null;
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    try {
      await db
        .update(admins)
        .set({ lastLogin: new Date() })
        .where(eq(admins.id, id));
    } catch (error) {
      console.error('[AuthRepository] updateLastLogin error:', error);
    }
  }

  private mapRow(row: typeof admins.$inferSelect): AdminDocument {
    return {
      id: row.id,
      name: row.name ?? '',
      email: row.email ?? '',
      passwordHash: row.passwordHash ?? '',
      role: row.role ?? '',
      avatarUrl: row.avatarUrl ?? '',
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      lastLogin: row.lastLogin?.toISOString() ?? undefined,
    };
  }
}
