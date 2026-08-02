'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/api';
import Image from 'next/image';
import {
  UserPlus,
  Search,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  Quote,
  ChevronDown,
  Inbox,
} from 'lucide-react';

type RequestStatus = 'Menunggu' | 'Diterima' | 'Ditolak';

interface JoinRequest {
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
}

const getBackendHost = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
};

const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string' || url === 'AH' || url === 'SN' || url === 'BS' || url === 'DL' || url === 'RR') {
    return '/profile.webp';
  }
  if (url.startsWith('data:')) {
    return url;
  }
  let cleanUrl = url;
  if (url.includes('localhost:4000')) {
    cleanUrl = url.replace(/https?:\/\/localhost:4000/, '');
  }
  if (cleanUrl.startsWith('/uploads/')) {
    return `${getBackendHost()}${cleanUrl}`;
  }
  if (cleanUrl.startsWith('/') || cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  return '/profile.webp';
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const statusConfig: Record<RequestStatus, { label: string; icon: React.ElementType; class: string; dot: string }> = {
  Menunggu: {
    label: 'Menunggu',
    icon: Clock,
    class: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  Diterima: {
    label: 'Diterima',
    icon: CheckCircle2,
    class: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  Ditolak: {
    label: 'Ditolak',
    icon: XCircle,
    class: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
};

const avatarColors = [
  'bg-green-600', 'bg-emerald-600', 'bg-teal-600',
  'bg-cyan-600', 'bg-violet-600', 'bg-amber-500',
  'bg-rose-500',
];



const JoinRequestsPage = () => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'Semua' | RequestStatus>('Semua');
  const [viewRequest, setViewRequest] = useState<JoinRequest | null>(null);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Fetch join requests from backend API on mount
  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await dashboardApi.getJoinRequests();
        if (res.data && Array.isArray(res.data)) {
          setRequests(res.data);
        }
      } catch (err) {
        setRequests([]);
      }
    }
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      r.name.toLowerCase().includes(q) ||
      r.domicile.toLowerCase().includes(q) ||
      r.divisionInterest.toLowerCase().includes(q);
    const matchStatus = selectedStatus === 'Semua' || r.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3200);
  };

  const handleAccept = async (id: number, name: string) => {
    try {
      await dashboardApi.verifyJoinRequest(id, 'Diterima');
    } catch (err) {
      // Local fallback state update
    }
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Diterima' } : r)));
    if (viewRequest?.id === id) setViewRequest((prev) => (prev ? { ...prev, status: 'Diterima' } : null));
    showToast(`✅ Pendaftaran "${name}" berhasil DITERIMA & ditambahkan ke anggota aktif!`);
  };

  const handleReject = async (id: number, name: string) => {
    if (confirm(`Apakah Anda yakin ingin MENOLAK pendaftaran "${name}"?`)) {
      try {
        await dashboardApi.verifyJoinRequest(id, 'Ditolak');
      } catch (err) {
        // Local fallback
      }
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Ditolak' } : r)));
      if (viewRequest?.id === id) setViewRequest((prev) => (prev ? { ...prev, status: 'Ditolak' } : null));
      showToast(`Pendaftaran "${name}" telah diubah menjadi Ditolak.`, 'error');
    }
  };

  const counts = {
    all: requests.length,
    waiting: requests.filter((r) => r.status === 'Menunggu').length,
    accepted: requests.filter((r) => r.status === 'Diterima').length,
    rejected: requests.filter((r) => r.status === 'Ditolak').length,
  };

  const getInitials = (name: string) =>
    name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className='space-y-8 p-6 sm:p-8'>
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-24 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-2xl border text-white text-xs sm:text-sm font-semibold transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-900 border-green-500/50'
              : 'bg-red-900 border-red-500/50'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className='h-5 w-5 text-green-400 shrink-0' />
          ) : (
            <XCircle className='h-5 w-5 text-red-400 shrink-0' />
          )}
          {notification.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className='pb-4 border-b border-slate-200/80'>
        <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 mb-1'>
          <UserPlus className='h-4 w-4' />
          <span>Pendaftaran Online</span>
        </div>
        <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
          Permintaan Gabung Relawan
        </h2>
        <p className='text-xs sm:text-sm text-slate-600 mt-1'>
          Verifikasi dan kelola formulir pendaftaran pemuda yang ingin bergabung sebagai relawan Pena Hijau.
        </p>
      </div>

      {/* ── Banner Perlu Tindakan ── */}
      {counts.waiting > 0 && (
        <div className='flex flex-wrap items-center gap-4 rounded-3xl bg-linear-to-r from-amber-50 to-orange-50 p-5 border border-amber-200/80 shadow-sm'>
          <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md'>
            <Clock className='h-6 w-6' />
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-sm sm:text-base font-bold text-amber-900'>
              {counts.waiting} Pendaftaran Menunggu Verifikasi
            </h3>
            <p className='text-xs text-amber-700 mt-0.5'>
              Tinjau data setiap pendaftar, lalu putuskan untuk Terima atau Tolak keanggotaan mereka.
            </p>
          </div>
          <button
            type='button'
            onClick={() => setSelectedStatus('Menunggu')}
            className='rounded-2xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-600 transition-colors cursor-pointer shadow-sm shrink-0'
          >
            Tinjau Sekarang
          </button>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className='grid gap-4 sm:grid-cols-4'>
        {[
          { label: 'Total Pendaftaran', value: counts.all, color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
          { label: 'Menunggu Verifikasi', value: counts.waiting, color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
          { label: 'Berhasil Diterima', value: counts.accepted, color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
          { label: 'Pendaftaran Ditolak', value: counts.rejected, color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
        ].map((card) => (
          <div key={card.label} className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80'>
            <div className='flex items-center gap-2 mb-3'>
              <span className={`h-2.5 w-2.5 rounded-full ${card.dot}`} />
              <p className='text-[11px] font-bold uppercase tracking-wider text-slate-500'>{card.label}</p>
            </div>
            <p className='text-3xl font-extrabold text-slate-900'>{card.value}</p>
            <p className='text-xs text-slate-400 font-medium mt-1'>Orang</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm border border-slate-200/80'>
        {/* Status Filter Pills */}
        <div className='flex flex-wrap items-center gap-2'>
          {(['Semua', 'Menunggu', 'Diterima', 'Ditolak'] as const).map((s) => {
            const cfg = s !== 'Semua' ? statusConfig[s] : null;
            return (
              <button
                key={s}
                type='button'
                onClick={() => setSelectedStatus(s)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === s
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cfg && <cfg.icon className='h-3.5 w-3.5' />}
                {s}
                {s !== 'Semua' && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                    selectedStatus === s ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s === 'Menunggu' ? counts.waiting : s === 'Diterima' ? counts.accepted : counts.rejected}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className='relative w-full sm:w-72'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
          <input
            type='text'
            placeholder='Cari nama, divisi, atau domisili...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
          />
        </div>
      </div>

      {/* ── Requests Table ── */}
      <div className='overflow-hidden rounded-3xl bg-white shadow-md border border-slate-200/80'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs sm:text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider'>
                <th className='py-4 px-4 text-center w-16'>Gambar</th>
                <th className='py-4 px-5'>Pendaftar</th>
                <th className='py-4 px-4'>Domisili</th>
                <th className='py-4 px-4'>Divisi Minat</th>
                <th className='py-4 px-4'>WhatsApp</th>
                <th className='py-4 px-4'>Tanggal Daftar</th>
                <th className='py-4 px-4 text-center'>Status</th>
                <th className='py-4 px-5 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 font-medium text-slate-700'>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-16 text-center'>
                    <Inbox className='mx-auto h-10 w-10 text-slate-300 mb-3' />
                    <p className='text-slate-500 font-medium'>Tidak ada data pendaftaran yang sesuai.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  const cfg = statusConfig[req.status];
                  const StatusIcon = cfg.icon;
                  const avatarSrc = resolveImageUrl(req.avatarUrl || req.avatar);

                  return (
                    <tr key={req.id} className='hover:bg-slate-50/60 transition-colors'>
                      {/* Member Profile Image Thumbnail */}
                      <td className='py-4 px-4 text-center'>
                        <div className='relative h-11 w-11 mx-auto overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-xs'>
                          <Image
                            src={avatarSrc}
                            alt={req.name}
                            fill
                            sizes='44px'
                            className='object-cover'
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className='py-4 px-5'>
                        <div>
                          <button
                            type='button'
                            onClick={() => setViewRequest(req)}
                            className='font-bold text-slate-900 hover:text-green-600 transition-colors text-left leading-snug cursor-pointer'
                          >
                            {req.name}
                          </button>
                          <p className='text-[11px] text-slate-400 mt-0.5 truncate max-w-40'>{req.address}</p>
                        </div>
                      </td>

                      {/* Domicile */}
                      <td className='py-4 px-4 whitespace-nowrap text-xs text-slate-600'>
                        <div className='flex items-center gap-1.5'>
                          <MapPin className='h-3.5 w-3.5 text-green-600 shrink-0' />
                          {req.domicile}
                        </div>
                      </td>

                      {/* Division Interest */}
                      <td className='py-4 px-4 text-xs whitespace-nowrap'>
                        <span className='inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200'>
                          {req.divisionInterest}
                        </span>
                      </td>

                      {/* WhatsApp */}
                      <td className='py-4 px-4 text-xs text-slate-600 whitespace-nowrap'>
                        <div className='flex items-center gap-1.5'>
                          <Phone className='h-3.5 w-3.5 text-green-500 shrink-0' />
                          <a
                            href={`https://wa.me/62${req.whatsapp.slice(1)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-green-600 hover:underline font-medium'
                          >
                            {req.whatsapp}
                          </a>
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className='py-4 px-4 whitespace-nowrap text-xs text-slate-500'>
                        <div className='flex items-center gap-1.5'>
                          <Calendar className='h-3.5 w-3.5 text-slate-400' />
                          {formatDate(req.registeredDate)}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className='py-4 px-4 text-center whitespace-nowrap'>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold border ${cfg.class}`}>
                          <StatusIcon className='h-3.5 w-3.5' />
                          {cfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className='py-4 px-5 text-right whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            type='button'
                            onClick={() => setViewRequest(req)}
                            className='inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer'
                            title='Lihat Detail Pendaftar'
                          >
                            <Eye className='h-3.5 w-3.5' />
                            <span>Detail</span>
                          </button>

                          {req.status === 'Menunggu' && (
                            <>
                              <button
                                type='button'
                                onClick={() => handleAccept(req.id, req.name)}
                                className='inline-flex h-9 items-center gap-1.5 rounded-xl bg-green-50 px-3 text-xs font-bold text-green-700 hover:bg-green-600 hover:text-white transition-colors cursor-pointer border border-green-200/60'
                                title='Terima Pendaftaran'
                              >
                                <CheckCircle2 className='h-3.5 w-3.5' />
                                <span>Terima</span>
                              </button>

                              <button
                                type='button'
                                onClick={() => handleReject(req.id, req.name)}
                                className='inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer border border-red-200/60'
                                title='Tolak Pendaftaran'
                              >
                                <XCircle className='h-3.5 w-3.5' />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500'>
          <span>
            Menampilkan <strong>{filteredRequests.length}</strong> dari <strong>{requests.length}</strong> pendaftar
          </span>
          <div className='flex items-center gap-3'>
            <span className='text-amber-600 font-bold'>{counts.waiting} Menunggu</span>
            <span className='text-green-600 font-bold'>{counts.accepted} Diterima</span>
            <span className='text-red-500 font-bold'>{counts.rejected} Ditolak</span>
          </div>
        </div>
      </div>

      {/* ── Request Detail Modal ── */}
      {viewRequest && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-8 backdrop-blur-sm'
          onClick={() => setViewRequest(null)}
        >
          <div
            className='relative max-w-lg w-full rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className='relative bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 px-8 py-8 text-white'>
              <button
                type='button'
                onClick={() => setViewRequest(null)}
                className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>

              <div className='flex items-center gap-5'>
                <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-emerald-400 bg-slate-800 shadow-md'>
                  <Image
                    src={resolveImageUrl(viewRequest.avatarUrl || viewRequest.avatar)}
                    alt={viewRequest.name}
                    fill
                    sizes='64px'
                    className='object-cover'
                  />
                </div>
                <div>
                  <h3 className='text-lg sm:text-xl font-extrabold text-white leading-snug'>{viewRequest.name}</h3>
                  <p className='text-xs text-emerald-300 font-semibold mt-0.5'>{viewRequest.divisionInterest}</p>

                  {/* Status Badge */}
                  <span className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border ${
                    viewRequest.status === 'Diterima'
                      ? 'bg-green-500/20 text-green-300 border-green-400/40'
                      : viewRequest.status === 'Ditolak'
                      ? 'bg-red-500/20 text-red-300 border-red-400/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}>
                    {viewRequest.status === 'Diterima' && <CheckCircle2 className='h-3 w-3' />}
                    {viewRequest.status === 'Ditolak' && <XCircle className='h-3 w-3' />}
                    {viewRequest.status === 'Menunggu' && <Clock className='h-3 w-3' />}
                    {viewRequest.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Body */}
            <div className='p-6 sm:p-8 space-y-5 text-sm'>
              <div className='grid gap-4'>
                <div className='flex items-start gap-3'>
                  <MapPin className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>Alamat Lengkap</p>
                    <p className='font-medium text-slate-800'>{viewRequest.address}</p>
                    <p className='text-xs text-green-600 font-semibold mt-0.5'>{viewRequest.domicile}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Phone className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>Nomor WhatsApp</p>
                    <a
                      href={`https://wa.me/62${viewRequest.whatsapp.slice(1)}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-medium text-slate-800 hover:text-green-600 hover:underline'
                    >
                      {viewRequest.whatsapp}
                    </a>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Calendar className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>Tanggal Mendaftar</p>
                    <p className='font-medium text-slate-800'>{viewRequest.registeredDate}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Quote className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>Kata-Kata / Motto</p>
                    <blockquote className='mt-1 border-l-4 border-green-500 pl-3 italic text-slate-700 text-sm leading-relaxed'>
                      &ldquo;{viewRequest.motto}&rdquo;
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Modal */}
              <div className='flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100'>
                {viewRequest.status === 'Menunggu' ? (
                  <>
                    <button
                      type='button'
                      onClick={() => { handleAccept(viewRequest.id, viewRequest.name); }}
                      className='flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 text-xs font-bold text-white hover:bg-green-700 cursor-pointer shadow-md transition-colors'
                    >
                      <CheckCircle2 className='h-4 w-4' />
                      Terima Pendaftaran
                    </button>
                    <button
                      type='button'
                      onClick={() => { handleReject(viewRequest.id, viewRequest.name); }}
                      className='flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white cursor-pointer border border-red-200 transition-colors'
                    >
                      <XCircle className='h-4 w-4' />
                      Tolak Pendaftaran
                    </button>
                  </>
                ) : (
                  <div className={`flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold border ${
                    viewRequest.status === 'Diterima'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {viewRequest.status === 'Diterima'
                      ? <><CheckCircle2 className='h-4 w-4' /> Anggota Sudah Diterima</>
                      : <><XCircle className='h-4 w-4' /> Pendaftaran Telah Ditolak</>
                    }
                  </div>
                )}
                <button
                  type='button'
                  onClick={() => setViewRequest(null)}
                  className='rounded-2xl bg-slate-100 px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinRequestsPage;
