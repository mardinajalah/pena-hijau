'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Images,
  UserPlus,
  Newspaper,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';

const statCards = [
  {
    id: 1,
    title: 'Total Anggota Relawan',
    value: '1.248',
    unit: 'Orang',
    change: '+12% bulan ini',
    icon: Users,
    color: 'from-green-600 to-emerald-700',
    iconBg: 'bg-green-100 text-green-700',
  },
  {
    id: 2,
    title: 'Kegiatan & Event Galeri',
    value: '26',
    unit: 'Dokumentasi',
    change: '25 Desa Mitra',
    icon: Images,
    color: 'from-emerald-600 to-teal-700',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 3,
    title: 'Permintaan Gabung Baru',
    value: '14',
    unit: 'Menunggu',
    change: 'Butuh Verifikasi',
    icon: UserPlus,
    color: 'from-teal-600 to-cyan-700',
    iconBg: 'bg-teal-100 text-teal-700',
    badge: 'Perlu Tindakan',
  },
  {
    id: 4,
    title: 'Artikel & Pilar Aksi',
    value: '8',
    unit: 'Publikasi',
    change: 'Terbuka Untuk Umum',
    icon: Newspaper,
    color: 'from-cyan-600 to-blue-700',
    iconBg: 'bg-cyan-100 text-cyan-700',
  },
];

const recentMembers = [
  {
    id: 1,
    name: 'Ahmad Hidayat, S.P.',
    address: 'Desa Kotaanyar, Probolinggo',
    division: 'Koordinator Lapangan & Clean-Up',
    date: '01 Agustus 2026',
    status: 'Aktif',
    avatar: 'AH',
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    address: 'Kec. Kraksaan, Probolinggo',
    division: 'Tim Edukasi & Bank Sampah',
    date: '31 Juli 2026',
    status: 'Menunggu',
    avatar: 'SN',
  },
  {
    id: 3,
    name: 'Budi Santoso',
    address: 'Desa Pesisir Hijau, Situbondo',
    division: 'Penghijauan & Bibit Pohon',
    date: '30 Juli 2026',
    status: 'Aktif',
    avatar: 'BS',
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    address: 'Kotaanyar, Probolinggo',
    division: 'Media & Kampanye Digital',
    date: '29 Juli 2026',
    status: 'Menunggu',
    avatar: 'DL',
  },
  {
    id: 5,
    name: 'Rahmat Ramadhan',
    address: 'Kec. Paiton, Probolinggo',
    division: 'Koordinator Lapangan & Clean-Up',
    date: '28 Juli 2026',
    status: 'Aktif',
    avatar: 'RR',
  },
];

const DashboardHomePage = () => {
  return (
    <div className='space-y-8 p-6 sm:p-8'>
      {/* ── Welcome Banner ── */}
      <div className='relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 p-8 sm:p-10 text-white shadow-xl border border-emerald-800/60'>
        <div className='pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-green-500/20 blur-3xl' />

        <div className='relative z-10 max-w-3xl'>
          <div className='inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-green-300 border border-green-400/30 backdrop-blur mb-4'>
            <Sparkles className='h-3.5 w-3.5' />
            <span>Pena Hijau Management Portal</span>
          </div>

          <h2 className='text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight'>
            Selamat Datang Kembali, Taufiqur Rohim! 👋
          </h2>

          <p className='mt-3 text-sm sm:text-base leading-relaxed text-emerald-100/90'>
            Pantau statistik perkembangan gerakan pemuda peduli lingkungan, verifikasi pendaftar relawan baru, dan perbarui dokumentasi galeri aksi lapangan secara efisien.
          </p>

          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <Link
              href='/join-requests'
              className='inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-green-500 hover:scale-[1.02]'
            >
              <UserPlus className='h-4 w-4' />
              <span>Verifikasi 14 Pendaftar Baru</span>
            </Link>

            <Link
              href='/gallery'
              className='inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-100 hover:bg-white/20 transition-all border border-white/15'
            >
              <Images className='h-4 w-4' />
              <span>Kelola Galeri Kegiatan</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat Cards Grid ── */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className='group relative overflow-hidden rounded-3xl bg-white p-6 shadow-md border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-950/5'
            >
              <div className='flex items-center justify-between'>
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg} shadow-xs font-bold`}>
                  <Icon className='h-6 w-6' />
                </span>

                {card.badge && (
                  <span className='rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-extrabold text-red-600 border border-red-200'>
                    {card.badge}
                  </span>
                )}
              </div>

              <div className='mt-5'>
                <p className='text-xs font-bold uppercase tracking-wider text-slate-500'>{card.title}</p>
                <div className='mt-1 flex items-baseline gap-2'>
                  <span className='text-3xl font-extrabold text-slate-900 tracking-tight'>{card.value}</span>
                  <span className='text-xs font-semibold text-slate-500'>{card.unit}</span>
                </div>
              </div>

              <div className='mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-green-600'>
                <span className='flex items-center gap-1'>
                  <TrendingUp className='h-3.5 w-3.5' />
                  {card.change}
                </span>
                <ChevronRight className='h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-green-600' />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main Content Split Grid ── */}
      <div className='grid gap-8 lg:grid-cols-12 items-start'>
        {/* Left Column: Recent Registrations Table (Col 8) */}
        <div className='lg:col-span-8 rounded-3xl bg-white p-6 sm:p-8 shadow-md border border-slate-200/80'>
          <div className='flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100'>
            <div>
              <h3 className='text-lg font-bold text-slate-900'>Pendaftaran Relawan Terbaru</h3>
              <p className='text-xs text-slate-500 mt-0.5'>Daftar pemuda yang baru mengisi formulir keanggotaan online</p>
            </div>
            <Link
              href='/join-requests'
              className='inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 hover:underline'
            >
              <span>Lihat Semua</span>
              <ArrowUpRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs sm:text-sm'>
              <thead>
                <tr className='border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider'>
                  <th className='py-3.5 px-4 rounded-l-2xl'>Relawan</th>
                  <th className='py-3.5 px-4'>Domisili</th>
                  <th className='py-3.5 px-4'>Divisi</th>
                  <th className='py-3.5 px-4'>Tanggal</th>
                  <th className='py-3.5 px-4 rounded-r-2xl text-right'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 font-medium text-slate-700'>
                {recentMembers.map((member) => (
                  <tr key={member.id} className='hover:bg-slate-50/60 transition-colors'>
                    <td className='py-4 px-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 font-extrabold text-xs shadow-xs'>
                          {member.avatar}
                        </div>
                        <div>
                          <p className='font-bold text-slate-900 leading-snug'>{member.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className='py-4 px-4 text-xs text-slate-600'>
                      <div className='flex items-center gap-1.5'>
                        <MapPin className='h-3.5 w-3.5 text-green-600 shrink-0' />
                        <span className='truncate max-w-35'>{member.address}</span>
                      </div>
                    </td>
                    <td className='py-4 px-4 text-xs text-slate-600'>
                      <span className='line-clamp-1'>{member.division}</span>
                    </td>
                    <td className='py-4 px-4 text-xs text-slate-500 whitespace-nowrap'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-3.5 w-3.5 text-slate-400' />
                        {member.date}
                      </div>
                    </td>
                    <td className='py-4 px-4 text-right whitespace-nowrap'>
                      {member.status === 'Aktif' ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700 border border-green-200'>
                          <CheckCircle2 className='h-3 w-3' />
                          Aktif
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700 border border-amber-200'>
                          <Clock className='h-3 w-3' />
                          Menunggu
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Event & System Summary Widget (Col 4) */}
        <div className='lg:col-span-4 space-y-6'>
          {/* Recent Event Card */}
          <div className='overflow-hidden rounded-3xl bg-white p-6 shadow-md border border-slate-200/80'>
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-4'>
              <h3 className='text-base font-bold text-slate-900'>Event Lapangan Terakhir</h3>
              <span className='rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700'>TERBARU</span>
            </div>

            <div className='relative h-44 w-full overflow-hidden rounded-2xl bg-slate-900 mb-4 shadow-sm'>
              <Image
                src='/gallery/sungai-kotaanyar-2026/sungai-karanganyar-4.webp'
                alt='Aksi Bersih Sungai Kotaanyar'
                fill
                sizes='400px'
                className='object-cover'
              />
              <div className='absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent' />
              <div className='absolute bottom-3 left-3 right-3 text-white'>
                <p className='text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1'>
                  <MapPin className='h-3 w-3' /> Kec. Kotaanyar, Probolinggo
                </p>
                <h4 className='text-sm font-bold truncate'>Aksi Bersih Sampah Aliran Sungai</h4>
              </div>
            </div>

            <p className='text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4'>
              Gotong-royong pemuda Pena Hijau membersihkan limbah plastik dan sampah yang menyumbat jembatan sungai Kotaanyar.
            </p>

            <div className='flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500'>
              <span>7 Foto Terlampir</span>
              <Link href='/gallery' className='text-green-600 font-bold flex items-center gap-1 hover:underline'>
                <span>Lihat Galeri</span>
                <Eye className='h-3.5 w-3.5' />
              </Link>
            </div>
          </div>

          {/* Quick System Info Widget */}
          <div className='rounded-3xl bg-emerald-950 p-6 text-white shadow-md border border-emerald-900'>
            <h4 className='text-sm font-extrabold text-white mb-2 flex items-center gap-2'>
              <Sparkles className='h-4 w-4 text-green-400' />
              <span>Status Integrasi Frontend</span>
            </h4>
            <p className='text-xs text-emerald-200/80 leading-relaxed mb-4'>
              Dashboard terhubung dengan struktur aplikasi utama (`apps/frontend`). Semua tampilan siap disinkronisasikan.
            </p>

            <div className='space-y-2 text-xs font-medium text-emerald-100'>
              <div className='flex items-center justify-between p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-800/60'>
                <span>Frontend Status</span>
                <span className='font-bold text-green-400'>Online (Port 3000)</span>
              </div>
              <div className='flex items-center justify-between p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-800/60'>
                <span>Versi Next.js</span>
                <span className='font-bold text-white'>16.2.12 (Turbopack)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
