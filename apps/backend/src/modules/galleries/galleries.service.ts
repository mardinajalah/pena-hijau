import { GalleriesRepository, GalleryDocument, PhotoItem } from './galleries.repository';

export interface GalleryQueryOptions {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class GalleriesService {
  private galleriesRepository: GalleriesRepository;

  constructor() {
    this.galleriesRepository = new GalleriesRepository();
  }

  async getAllGalleries(options: GalleryQueryOptions = {}) {
    const all = await this.galleriesRepository.findAll();

    let filtered = [...all];

    if (options.category && options.category !== 'Semua') {
      filtered = filtered.filter((g) => g.category === options.category);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (g) => g.title.toLowerCase().includes(q) || g.location.toLowerCase().includes(q),
      );
    }

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtered.slice(startIndex, startIndex + limit);

    const totalPhotos = all.reduce((acc, g) => acc + g.photos.length, 0);

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
        totalEvents: all.length,
        totalPhotos,
        totalVillages: 25,
      },
    };
  }

  async getGalleryById(id: number) {
    const gallery = await this.galleriesRepository.findById(id);
    if (!gallery) {
      throw { statusCode: 404, message: 'Event galeri kegiatan tidak ditemukan' };
    }
    return gallery;
  }

  async createGallery(data: Partial<GalleryDocument>) {
    if (!data.title?.trim()) {
      throw { statusCode: 400, message: 'Judul event galeri wajib diisi' };
    }

    const newGalleryData: Omit<GalleryDocument, 'id' | 'createdAt'> = {
      title: data.title,
      category: (data.category as any) || 'Aksi Clean-Up',
      location: data.location || 'Desa Mitra, Probolinggo',
      date: data.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      coverImage: data.coverImage || '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      description: data.description || 'Dokumentasi kegiatan aksi lingkungan Pena Hijau.',
      photoCount: data.photos?.length || 1,
      photos: data.photos || [
        { id: Date.now(), url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp' },
      ],
    };

    return await this.galleriesRepository.create(newGalleryData);
  }

  async updateGallery(id: number, data: Partial<GalleryDocument>) {
    const existing = await this.galleriesRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Event galeri tidak ditemukan' };
    }

    return await this.galleriesRepository.update(id, data);
  }

  async addPhotoToGallery(id: number, photoUrl: string, caption?: string) {
    const existing = await this.galleriesRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Event galeri tidak ditemukan' };
    }

    const newPhoto: PhotoItem = {
      id: Date.now(),
      url: photoUrl,
      caption: caption || '',
    };

    const updatedPhotos = [...existing.photos, newPhoto];
    return await this.galleriesRepository.update(id, {
      photos: updatedPhotos,
      photoCount: updatedPhotos.length,
    });
  }

  async deletePhotoFromGallery(id: number, photoId: number) {
    const existing = await this.galleriesRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Event galeri tidak ditemukan' };
    }

    const updatedPhotos = existing.photos.filter((p) => p.id !== photoId);
    return await this.galleriesRepository.update(id, {
      photos: updatedPhotos,
      photoCount: updatedPhotos.length,
    });
  }

  async deleteGallery(id: number) {
    const existing = await this.galleriesRepository.findById(id);
    if (!existing) {
      throw { statusCode: 404, message: 'Event galeri tidak ditemukan' };
    }

    await this.galleriesRepository.delete(id);
    return true;
  }
}
