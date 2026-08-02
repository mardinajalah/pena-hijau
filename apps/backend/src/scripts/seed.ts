import { db } from '../db';
import { admins, members, joinRequests, galleries, articles } from '../db/schema';

const adminData = [
  {
    id: 1,
    name: 'Taufiqur Rohim',
    email: 'admin@penahijau.org',
    passwordHash: '$2a$10$w3GvA4O2.3R6qD9mX3.09O4cT7dZkL9Y6Pq5mR8vW0t1X2Y3Z4A5B',
    role: 'Super Admin',
    avatarUrl: '/avatars/admin.webp',
    createdAt: new Date(),
  },
];

const membersData = [
  {
    id: 1,
    name: 'Ahmad Hidayat, S.P.',
    address: 'Jl. Melati No. 12, Desa Kotaanyar',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Koordinator Lapangan & Clean-Up',
    whatsapp: '082233441122',
    motto: 'Alam yang sehat adalah warisan terbaik untuk generasi mendatang.',
    status: 'Aktif' as const,
    joinDate: new Date('2024-03-12T00:00:00.000Z'),
    avatar: 'AH',
    createdAt: new Date('2024-03-12T10:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    address: 'Jl. Anggrek No. 5, Kec. Kraksaan',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Tim Edukasi & Bank Sampah',
    whatsapp: '085678901234',
    motto: 'Edukasi adalah kunci perubahan lingkungan yang berkelanjutan.',
    status: 'Aktif' as const,
    joinDate: new Date('2024-06-28T00:00:00.000Z'),
    avatar: 'SN',
    createdAt: new Date('2024-06-28T10:00:00.000Z'),
  },
  {
    id: 3,
    name: 'Budi Santoso',
    address: 'Jl. Kenanga No. 7, Desa Pesisir Hijau',
    domicile: 'Situbondo, Jawa Timur',
    division: 'Penghijauan & Bibit Pohon',
    whatsapp: '081234567890',
    motto: 'Setiap pohon yang kita tanam hari ini adalah nafas anak cucu esok hari.',
    status: 'Aktif' as const,
    joinDate: new Date('2025-01-05T00:00:00.000Z'),
    avatar: 'BS',
    createdAt: new Date('2025-01-05T10:00:00.000Z'),
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    address: 'Jl. Flamboyan No. 3, Kec. Kotaanyar',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Media & Kampanye Digital',
    whatsapp: '089876543210',
    motto: 'Satu konten viral bisa menggerakkan ribuan tangan untuk alam.',
    status: 'Aktif' as const,
    joinDate: new Date('2024-08-17T00:00:00.000Z'),
    avatar: 'DL',
    createdAt: new Date('2024-08-17T10:00:00.000Z'),
  },
  {
    id: 5,
    name: 'Rahmat Ramadhan',
    address: 'Jl. Padi No. 21, Kec. Paiton',
    domicile: 'Probolinggo, Jawa Timur',
    division: 'Koordinator Lapangan & Clean-Up',
    whatsapp: '083344556677',
    motto: 'Turun ke lapangan adalah bentuk cinta paling nyata pada lingkungan.',
    status: 'Nonaktif' as const,
    joinDate: new Date('2024-02-03T00:00:00.000Z'),
    avatar: 'RR',
    createdAt: new Date('2024-02-03T10:00:00.000Z'),
  },
];

const joinRequestsData = [
  {
    id: 1,
    name: 'Rizky Firmansyah',
    address: 'Jl. Merpati No. 4, Kec. Kotaanyar',
    domicile: 'Probolinggo, Jawa Timur',
    divisionInterest: 'Koordinator Lapangan & Clean-Up',
    whatsapp: '082211223344',
    motto: 'Sungai bersih dimulai dari tangan kita sendiri.',
    registeredDate: new Date('2026-08-01T00:00:00.000Z'),
    status: 'Menunggu' as const,
    createdAt: new Date('2026-08-01T10:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Nur Aini Rahayu',
    address: 'Jl. Bougenville No. 8, Kec. Kraksaan',
    domicile: 'Probolinggo, Jawa Timur',
    divisionInterest: 'Tim Edukasi & Bank Sampah',
    whatsapp: '085599887766',
    motto: 'Ilmu tanpa aksi adalah sia-sia.',
    registeredDate: new Date('2026-07-31T00:00:00.000Z'),
    status: 'Menunggu' as const,
    createdAt: new Date('2026-07-31T15:00:00.000Z'),
  },
];

const galleriesData = [
  {
    id: 1,
    title: 'Aksi Bersih Sampah Aliran Sungai Kotaanyar',
    category: 'Aksi Clean-Up' as const,
    location: 'Desa Kotaanyar, Probolinggo',
    date: '27 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
    description:
      'Relawan Pena Hijau bersama warga bergotong-royong membersihkan limbah plastik di jembatan sungai Kotaanyar.',
    photoCount: 7,
    photos: [
      { id: 101, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp', caption: 'Persiapan tim relawan' },
      { id: 102, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp', caption: 'Pembersihan sampah plastik' },
      { id: 103, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp', caption: 'Pengangkutan sampah ke truk' },
      { id: 104, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp', caption: 'Gotong royong relawan di bawah jembatan' },
      { id: 105, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp', caption: 'Kondisi aliran air sungai' },
      { id: 106, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp', caption: 'Foto bersama relawan' },
      { id: 107, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp', caption: 'Edukasi singkat warga' },
    ],
    createdAt: new Date('2026-07-27T10:00:00.000Z'),
  },
  {
    id: 2,
    title: 'Penanaman 500 Bibit Pohon Produktif',
    category: 'Penghijauan' as const,
    location: 'Kecamatan Paiton, Probolinggo',
    date: '15 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
    description: 'Aksi hijau menanam bibit pohon buah dan lindung di kawasan lereng kritis desa mitra.',
    photoCount: 3,
    photos: [
      { id: 201, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp', caption: 'Penanaman bibit pohon' },
      { id: 202, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp', caption: 'Penyiraman bibit' },
      { id: 203, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp', caption: 'Penyerahan bibit' },
    ],
    createdAt: new Date('2026-07-15T10:00:00.000Z'),
  },
  {
    id: 3,
    title: 'Edukasi Kelola Sampah Rumah Tangga & Komposting',
    category: 'Edukasi' as const,
    location: 'Desa Karanganyar, Probolinggo',
    date: '02 Juni 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
    description: 'Pelatihan pemilahan sampah organik dan anorganik dari dapur rumah tangga untuk dijadikan pupuk kompos.',
    photoCount: 2,
    photos: [
      { id: 301, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp', caption: 'Sosialisasi komposting' },
      { id: 302, url: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp', caption: 'Praktek pemilahan sampah' },
    ],
    createdAt: new Date('2026-06-02T10:00:00.000Z'),
  },
];

const articlesData = [
  {
    id: 1,
    title: 'Peduli Lingkungan, Komunitas PENA HIJAU Gelar Aksi Clean Up River di Kotaanyar Probolinggo',
    category: 'Aksi Clean-Up',
    date: '27 Juli 2026',
    location: 'Kecamatan Kotaanyar, Kabupaten Probolinggo',
    author: 'Taufiqur Rohim (Koordinator PENA HIJAU)',
    excerpt:
      'Kelompok pemuda Komunitas PENA HIJAU menggelar aksi bersih-bersih sungai di Kotaanyar Probolinggo sebagai langkah konkrit mencegah pencemaran dan bencana banjir.',
    paragraphs: [
      'PROBOLINGGO — Kelompok pemuda yang tergabung dalam Komunitas Pemuda Nusantara Peduli Lingkungan Hijau (PENA HIJAU) menggelar aksi clean up river (bersih-bersih sungai) di wilayah Kecamatan Kotaanyar, Kabupaten Probolinggo, Senin sore (27/07/2026).',
      'Aksi tanggap lingkungan ini dilakukan sebagai bentuk kepedulian nyata para generasi muda terhadap kondisi sungai yang kian tertutup tumpukan sampah plastik, limbah rumah tangga, dan kotoran liar yang mengganggu kelancaran aliran air.',
      'Dengan menggunakan peralatan lengkap seperti karung sampah, sepatu boots, dan sarung tangan, para relawan muda Pena Hijau secara langsung menyusuri dan mengangkat berbagai material sampah dari dasar serta pinggiran sungai.',
      'Langkah ini diharapkan tidak hanya dapat mengembalikan kebersihan dan kelancaran fungsi aliran sungai Kotaanyar, melainkan juga mengedukasi dan menggugah kesadaran masyarakat sekitar agar menghentikan kebiasaan membuang sampah sembarangan ke sungai.',
    ],
    quote: 'Kami melihat tumpukan sampah di aliran sungai ini sudah sangat mengkhawatirkan. Jika dibiarkan, saat musim hujan bisa memicu banjir dan pencemaran air.',
    image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
    galleryImages: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-1.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-5.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
    ],
    sources: [
      { name: 'Berdampak.net', url: 'https://berdampak.net/peduli-lingkungan-komunitas-pena-hijau-gelar-aksi-clean-up-river-di-kotaanyar-probolinggo/' },
      { name: 'HarianJatim.com', url: 'https://www.harianjatim.com/2026/07/27/aksi-nyata-komunitas-pena-hijau-bersihkan-tumpukan-sampah-di-sungai-kotaanyar-probolinggo/' },
    ],
    status: 'Dipublikasikan' as const,
    createdAt: new Date('2026-07-27T10:00:00.000Z'),
  },
  {
    id: 2,
    title: 'Gerakan Reboisasi & Penghijauan Lahan Kritis',
    category: 'Penghijauan',
    date: '15 Juli 2026',
    location: 'Kecamatan Paiton, Probolinggo',
    author: 'Divisi Penghijauan',
    excerpt: 'Program penanaman bibit pohon lindung dan produktif di titik-titik rawan longsor serta daerah resapan air.',
    paragraphs: [
      'Penanaman pohon ini merupakan bagian dari pilar ekologis jangka panjang Pena Hijau untuk meningkatkan daerah resapan air dan daya dukung lingkungan.',
      'Bibit yang ditanam mencakup pohon buah-buahan lokal dan pohon keras yang bermanfaat bagi generasi mendatang.',
    ],
    quote: 'Satu pohon yang kita tanam hari ini adalah oksigen bagi anak cucu kita besok.',
    image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
    galleryImages: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-2.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-6.webp',
    ],
    sources: [{ name: 'Kabar Hijau', url: 'https://example.com' }],
    status: 'Dipublikasikan' as const,
    createdAt: new Date('2026-07-15T10:00:00.000Z'),
  },
  {
    id: 3,
    title: 'Edukasi Lingkungan & Pemberdayaan Komunitas',
    category: 'Edukasi',
    date: '02 Juni 2026',
    location: 'Kabupaten Probolinggo',
    author: 'Divisi Edukasi & Publikasi',
    excerpt:
      'Memberikan pemahaman praktis mengenai pemilahan sampah organik & anorganik serta pengolahan kompos skala rumah tangga.',
    paragraphs: [
      'Pena Hijau menggelar workshop edukasi dan pendampingan pengelolaan sampah organik secara langsung kepada ibu-ibu dan pemuda desa.',
      'Dengan terbukanya wawasan mengenai nilai guna daur ulang sampah, diharapkan pembuangan sampah sembarangan dapat diminimalisir.',
    ],
    quote: 'Edukasi adalah kunci utama perubahan perilaku ramah lingkungan secara berkelanjutan.',
    image: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
    galleryImages: [
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-7.webp',
      '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-3.webp',
    ],
    sources: [{ name: 'Warta Eco', url: 'https://example.com' }],
    status: 'Dipublikasikan' as const,
    createdAt: new Date('2026-06-02T10:00:00.000Z'),
  },
];

export async function seedDatabase() {
  console.log('🌱 Starting MySQL (Drizzle ORM) Database Seeding...');

  try {
    // Seed admins
    for (const item of adminData) {
      await db.insert(admins).values(item).onDuplicateKeyUpdate({ set: { name: item.name } });
    }
    console.log('✅ Seeded admins table');

    // Seed members
    for (const item of membersData) {
      await db.insert(members).values(item).onDuplicateKeyUpdate({ set: { name: item.name } });
    }
    console.log('✅ Seeded members table');

    // Seed join requests
    for (const item of joinRequestsData) {
      await db.insert(joinRequests).values(item).onDuplicateKeyUpdate({ set: { name: item.name } });
    }
    console.log('✅ Seeded join_requests table');

    // Seed galleries
    for (const item of galleriesData) {
      await db.insert(galleries).values(item).onDuplicateKeyUpdate({ set: { title: item.title } });
    }
    console.log('✅ Seeded galleries table');

    // Seed articles
    for (const item of articlesData) {
      await db.insert(articles).values(item).onDuplicateKeyUpdate({ set: { title: item.title } });
    }
    console.log('✅ Seeded articles table');

    console.log('🎉 MySQL Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
