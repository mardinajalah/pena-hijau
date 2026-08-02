import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { members } from '../../db/schema';

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
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export class MembersRepository {
  async findAll(): Promise<MemberDocument[]> {
    try {
      const rows = await db.select().from(members);
      return rows.map(this.mapRow);
    } catch (error) {
      console.error('[MembersRepository] findAll error:', error);
      return [];
    }
  }

  async findById(id: number): Promise<MemberDocument | null> {
    try {
      const rows = await db.select().from(members).where(eq(members.id, id)).limit(1);
      if (rows.length === 0) return null;
      return this.mapRow(rows[0]);
    } catch (error) {
      console.error('[MembersRepository] findById error:', error);
      return null;
    }
  }

  async create(data: Omit<MemberDocument, 'id' | 'createdAt'>): Promise<MemberDocument> {
    const now = new Date();
    await db.insert(members).values({
      name: data.name,
      address: data.address,
      domicile: data.domicile,
      division: data.division,
      whatsapp: data.whatsapp,
      motto: data.motto,
      status: data.status,
      joinDate: data.joinDate ? new Date(data.joinDate) : now,
      avatarUrl: data.avatarUrl,
      createdAt: now,
    });

    const allRows = await db.select().from(members);
    const lastRow = allRows[allRows.length - 1];
    return this.mapRow(lastRow);
  }

  async update(id: number, data: Partial<MemberDocument>): Promise<MemberDocument | null> {
    const updatePayload: Record<string, any> = { updatedAt: new Date() };
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.address !== undefined) updatePayload.address = data.address;
    if (data.domicile !== undefined) updatePayload.domicile = data.domicile;
    if (data.division !== undefined) updatePayload.division = data.division;
    if (data.whatsapp !== undefined) updatePayload.whatsapp = data.whatsapp;
    if (data.motto !== undefined) updatePayload.motto = data.motto;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.joinDate !== undefined) updatePayload.joinDate = new Date(data.joinDate);
    if (data.avatarUrl !== undefined) updatePayload.avatarUrl = data.avatarUrl;

    await db.update(members).set(updatePayload).where(eq(members.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    await db.delete(members).where(eq(members.id, id));
    return true;
  }

  private mapRow(row: typeof members.$inferSelect): MemberDocument {
    return {
      id: row.id,
      name: row.name ?? '',
      address: row.address ?? '',
      domicile: row.domicile ?? '',
      division: row.division ?? '',
      whatsapp: row.whatsapp ?? '',
      motto: row.motto ?? '',
      status: (row.status as 'Aktif' | 'Nonaktif') ?? 'Aktif',
      joinDate: row.joinDate?.toISOString() ?? new Date().toISOString(),
      avatarUrl: row.avatarUrl ?? undefined,
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: row.updatedAt?.toISOString() ?? undefined,
    };
  }
}
