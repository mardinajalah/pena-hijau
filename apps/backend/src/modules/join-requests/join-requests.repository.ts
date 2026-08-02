import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { joinRequests } from '../../db/schema';

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
  avatarUrl?: string;
  avatar?: string;
  adminNote?: string;
  createdAt: string;
  verifiedAt?: string;
}

export class JoinRequestsRepository {
  async findAll(): Promise<JoinRequestDocument[]> {
    try {
      const rows = await db.select().from(joinRequests);
      return rows.map(this.mapRow);
    } catch (error) {
      console.error('[JoinRequestsRepository] findAll error:', error);
      return [];
    }
  }

  async findById(id: number): Promise<JoinRequestDocument | null> {
    try {
      const rows = await db
        .select()
        .from(joinRequests)
        .where(eq(joinRequests.id, id))
        .limit(1);
      if (rows.length === 0) return null;
      return this.mapRow(rows[0]);
    } catch (error) {
      console.error('[JoinRequestsRepository] findById error:', error);
      return null;
    }
  }

  async create(data: Omit<JoinRequestDocument, 'id' | 'createdAt'>): Promise<JoinRequestDocument> {
    const now = new Date();
    await db.insert(joinRequests).values({
      name: data.name,
      address: data.address,
      domicile: data.domicile,
      divisionInterest: data.divisionInterest,
      whatsapp: data.whatsapp,
      motto: data.motto,
      registeredDate: data.registeredDate ? new Date(data.registeredDate) : now,
      status: data.status,
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      createdAt: now,
    });

    const allRows = await db.select().from(joinRequests);
    const lastRow = allRows[allRows.length - 1];
    return this.mapRow(lastRow);
  }

  async updateStatus(
    id: number,
    status: RequestStatus,
    adminNote?: string,
  ): Promise<JoinRequestDocument | null> {
    const now = new Date();
    const updatePayload: Record<string, any> = { status, verifiedAt: now };
    if (adminNote) updatePayload.adminNote = adminNote;

    await db.update(joinRequests).set(updatePayload).where(eq(joinRequests.id, id));
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    await db.delete(joinRequests).where(eq(joinRequests.id, id));
    return true;
  }

  private mapRow(row: typeof joinRequests.$inferSelect): JoinRequestDocument {
    return {
      id: row.id,
      name: row.name ?? '',
      address: row.address ?? '',
      domicile: row.domicile ?? '',
      divisionInterest: row.divisionInterest ?? '',
      whatsapp: row.whatsapp ?? '',
      motto: row.motto ?? '',
      registeredDate: row.registeredDate?.toISOString() ?? new Date().toISOString(),
      status: (row.status as RequestStatus) ?? 'Menunggu',
      avatarUrl: row.avatarUrl ?? undefined,
      avatar: row.avatar ?? undefined,
      adminNote: row.adminNote ?? undefined,
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      verifiedAt: row.verifiedAt?.toISOString() ?? undefined,
    };
  }
}
