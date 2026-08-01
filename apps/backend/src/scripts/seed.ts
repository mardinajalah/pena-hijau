import { db } from '../config/firebase';

const admins = [
  {
    id: 1,
    name: 'Taufiqur Rohim',
    email: 'admin@penahijau.org',
    passwordHash: '$2a$10$w3GvA4O2.3R6qD9mX3.09O4cT7dZkL9Y6Pq5mR8vW0t1X2Y3Z4A5B',
    role: 'Super Admin',
    avatarUrl: '/avatars/admin.webp',
    createdAt: new Date().toISOString(),
  },
];

const members = [
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

const joinRequests = [
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
];

const galleries = [
  {
    id: 1,
    title: 'Aksi Bersih Sampah Aliran Sungai Kotaanyar',
    category: 'Aksi Clean-Up',
    location: 'Desa Kotaanyar, Probolinggo',
    date: '27 Juli 2026',
    coverImage: '/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp',
    description: 'Relawan Pena Hijau bersama warga bergotong-royong membersihkan limbah plastik di jembatan sungai Kotaanyar.',
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
    createdAt: '2026-07-27T10:00:00.000Z',
  },
];

const articles = [
  {
    id: 1,
    title: 'Peduli Lingkungan, Komunitas PENA HIJAU Gelar Aksi Clean Up River di Kotaanyar Probolinggo',
    category: 'Aksi Clean-Up',
    date: '27 Juli 2026',
    location: 'Kecamatan Kotaanyar, Kabupaten Probolinggo',
    author: 'Taufiqur Rohim (Koordinator PENA HIJAU)',
    excerpt: 'Kelompok pemuda Komunitas PENA HIJAU menggelar aksi bersih-bersih sungai di Kotaanyar Probolinggo sebagai langkah konkrit mencegah pencemaran dan bencana banjir.',
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
    status: 'Dipublikasikan',
    createdAt: '2026-07-27T10:00:00.000Z',
  },
];

export async function seedDatabase() {
  console.log('🌱 Starting Firebase Cloud Firestore Seeding...');

  try {
    for (const item of admins) {
      await db.collection('admins').doc(String(item.id)).set(item);
    }
    console.log('✅ Seeded admins collection');

    for (const item of members) {
      await db.collection('members').doc(String(item.id)).set(item);
    }
    console.log('✅ Seeded members collection');

    for (const item of joinRequests) {
      await db.collection('join_requests').doc(String(item.id)).set(item);
    }
    console.log('✅ Seeded join_requests collection');

    for (const item of galleries) {
      await db.collection('galleries').doc(String(item.id)).set(item);
    }
    console.log('✅ Seeded galleries collection');

    for (const item of articles) {
      await db.collection('articles').doc(String(item.id)).set(item);
    }
    console.log('✅ Seeded articles collection');

    console.log('🎉 Firestore Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
