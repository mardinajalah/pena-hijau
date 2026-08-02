import { JoinRequestsRepository, JoinRequestDocument, RequestStatus } from './join-requests.repository';
import { MembersRepository } from '../members/members.repository';

export class JoinRequestsService {
  private joinRequestsRepository: JoinRequestsRepository;
  private membersRepository: MembersRepository;

  constructor() {
    this.joinRequestsRepository = new JoinRequestsRepository();
    this.membersRepository = new MembersRepository();
  }

  async getAllRequests(status?: string, search?: string) {
    const all = await this.joinRequestsRepository.findAll();

    let filtered = [...all];

    if (status && status !== 'Semua') {
      filtered = filtered.filter((r) => r.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.domicile.toLowerCase().includes(q) ||
          r.divisionInterest.toLowerCase().includes(q),
      );
    }

    return {
      data: filtered,
      summary: {
        total: all.length,
        waiting: all.filter((r) => r.status === 'Menunggu').length,
        accepted: all.filter((r) => r.status === 'Diterima').length,
        rejected: all.filter((r) => r.status === 'Ditolak').length,
      },
    };
  }

  async getRequestById(id: number) {
    const request = await this.joinRequestsRepository.findById(id);
    if (!request) {
      throw { statusCode: 404, message: 'Formulir pendaftaran tidak ditemukan' };
    }
    return request;
  }

  async submitRequest(data: Partial<JoinRequestDocument>) {
    if (!data.name?.trim()) {
      throw { statusCode: 400, message: 'Nama lengkap wajib diisi' };
    }

    const avatarUrl = (data as any).avatarUrl || '/profile.webp';

    const newRequestData: Omit<JoinRequestDocument, 'id' | 'createdAt'> = {
      name: data.name,
      address: data.address || '-',
      domicile: data.domicile || 'Probolinggo, Jawa Timur',
      divisionInterest: data.divisionInterest || 'Koordinator Lapangan & Clean-Up',
      whatsapp: data.whatsapp || '-',
      motto: data.motto || 'Bersama menjaga kebersihan dan kelestarian alam.',
      registeredDate: new Date().toISOString(),
      status: 'Menunggu',
      avatarUrl,
    };

    const created = await this.joinRequestsRepository.create(newRequestData);

    return {
      requestId: created.id,
      name: created.name,
      divisionInterest: created.divisionInterest,
      status: created.status,
      registeredDate: created.registeredDate,
      avatarUrl: created.avatarUrl,
      memberCardPreview: {
        cardId: `PH-${new Date().getFullYear()}-${created.id}`,
        qrCodeUrl: `/qr/PH-${created.id}.png`,
      },
    };
  }

  async verifyRequest(id: number, status: RequestStatus, adminNote?: string) {
    const existing = await this.joinRequestsRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Formulir pendaftaran tidak ditemukan' };
    }

    const updated = await this.joinRequestsRepository.updateStatus(id, status, adminNote);

    let newMember = null;
    // Auto-create official member if accepted!
    if (status === 'Diterima') {
      const memberAvatar = existing.avatarUrl || '/profile.webp';
      newMember = await this.membersRepository.create({
        name: existing.name,
        address: existing.address,
        domicile: existing.domicile,
        division: existing.divisionInterest,
        whatsapp: existing.whatsapp,
        motto: existing.motto,
        status: 'Aktif',
        joinDate: new Date().toISOString(),
        avatarUrl: memberAvatar,
      });
    }

    return {
      requestId: updated?.id,
      name: updated?.name,
      status: updated?.status,
      ...(newMember && { newMemberId: newMember.id }),
      verifiedAt: updated?.verifiedAt,
    };
  }
}
