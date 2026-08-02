import { MembersRepository, MemberDocument } from './members.repository';

export interface MemberQueryOptions {
  search?: string;
  division?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class MembersService {
  private membersRepository: MembersRepository;

  constructor() {
    this.membersRepository = new MembersRepository();
  }

  async getAllMembers(options: MemberQueryOptions = {}) {
    const allMembers = await this.membersRepository.findAll();

    let filtered = [...allMembers];

    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.domicile.toLowerCase().includes(q) ||
          m.division.toLowerCase().includes(q),
      );
    }

    if (options.division && options.division !== 'Semua') {
      filtered = filtered.filter((m) => m.division === options.division);
    }

    if (options.status && options.status !== 'Semua') {
      filtered = filtered.filter((m) => m.status === options.status);
    }

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    const activeCount = allMembers.filter((m) => m.status === 'Aktif').length;
    const inactiveCount = allMembers.filter((m) => m.status === 'Nonaktif').length;

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      summary: {
        totalMembers: allMembers.length,
        activeCount,
        inactiveCount,
      },
    };
  }

  async getMemberById(id: number) {
    const member = await this.membersRepository.findById(id);
    if (!member) {
      throw { statusCode: 404, message: 'Data anggota relawan dengan ID tersebut tidak ditemukan' };
    }
    return member;
  }

  async createMember(data: Partial<MemberDocument>) {
    if (!data.name?.trim()) {
      throw { statusCode: 400, message: 'Nama anggota wajib diisi' };
    }

    const newMemberData: Omit<MemberDocument, 'id' | 'createdAt'> = {
      name: data.name,
      address: data.address || '-',
      domicile: data.domicile || 'Probolinggo, Jawa Timur',
      division: data.division || 'Koordinator Lapangan & Clean-Up',
      whatsapp: data.whatsapp || '-',
      motto: data.motto || 'Bersama menjaga alam untuk masa depan.',
      status: (data.status as 'Aktif' | 'Nonaktif') || 'Aktif',
      joinDate: new Date().toISOString(),
      avatarUrl: data.avatarUrl || '/profile.webp',
    };

    return await this.membersRepository.create(newMemberData);
  }

  async updateMember(id: number, data: Partial<MemberDocument>) {
    const existing = await this.membersRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Data anggota relawan tidak ditemukan' };
    }

    const updated = await this.membersRepository.update(id, data);
    return updated;
  }

  async toggleStatus(id: number, status?: 'Aktif' | 'Nonaktif') {
    const existing = await this.membersRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Data anggota relawan tidak ditemukan' };
    }

    const nextStatus = status || (existing.status === 'Aktif' ? 'Nonaktif' : 'Aktif');
    return await this.membersRepository.update(id, { status: nextStatus });
  }

  async deleteMember(id: number) {
    const existing = await this.membersRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Data anggota relawan tidak ditemukan' };
    }

    await this.membersRepository.delete(id);
    return true;
  }
}
