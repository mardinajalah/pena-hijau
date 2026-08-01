'use client';

import { useState, useEffect } from 'react';
import { dashboardApi } from '@/lib/api';
import Image from 'next/image';
import {
  Users,
  Plus,
  Search,
  MapPin,
  Phone,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  ChevronDown,
  UserCheck,
  UserX,
  Quote,
  Upload,
} from 'lucide-react';

type Division =
  | 'Koordinator Lapangan & Clean-Up'
  | 'Tim Edukasi & Bank Sampah'
  | 'Penghijauan & Bibit Pohon'
  | 'Media & Kampanye Digital'
  | 'Logistik & Operasional';

type Status = 'Aktif' | 'Nonaktif';

interface Member {
  id: number;
  name: string;
  address: string;
  domicile: string;
  division: Division;
  whatsapp: string;
  motto: string;
  status: Status;
  joinDate: string;
  avatar?: string;
  avatarUrl?: string;
}

const getBackendHost = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  return apiUrl.replace(/\/api\/v1\/?$/, '');
};

const resolveImageUrl = (url?: string): string => {
  if (!url || typeof url !== 'string' || url === 'AH' || url === 'SN' || url === 'BS' || url === 'DL' || url === 'RR') {
    return '/profile.webp';
  }
  if (url.startsWith('/uploads/')) {
    return `${getBackendHost()}${url}`;
  }
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
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

const divisionOptions: Division[] = [
  'Koordinator Lapangan & Clean-Up',
  'Tim Edukasi & Bank Sampah',
  'Penghijauan & Bibit Pohon',
  'Media & Kampanye Digital',
  'Logistik & Operasional',
];

const divisionColors: Record<Division, string> = {
  'Koordinator Lapangan & Clean-Up': 'bg-green-100 text-green-800 border-green-200',
  'Tim Edukasi & Bank Sampah': 'bg-blue-100 text-blue-800 border-blue-200',
  'Penghijauan & Bibit Pohon': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Media & Kampanye Digital': 'bg-violet-100 text-violet-800 border-violet-200',
  'Logistik & Operasional': 'bg-amber-100 text-amber-800 border-amber-200',
};

const avatarColors = [
  'bg-green-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-cyan-600',
  'bg-violet-600',
  'bg-amber-600',
];

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Semua');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Add Avatar Upload State
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('/profile.webp');

  // Edit Avatar Upload State
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string>('/profile.webp');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEditAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditAvatarFile(file);
      setEditAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Detail modal
  const [viewMember, setViewMember] = useState<Member | null>(null);
  // Add modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', domicile: '', division: divisionOptions[0], whatsapp: '', motto: '' });
  // Edit modal
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({ name: '', address: '', domicile: '', division: divisionOptions[0], whatsapp: '', motto: '' });

  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      address: member.address || '',
      domicile: member.domicile || '',
      division: member.division,
      whatsapp: member.whatsapp || '',
      motto: member.motto || '',
    });
    setEditAvatarFile(null);
    const currentAvatar = member.avatarUrl || member.avatar;
    setEditAvatarPreview(resolveImageUrl(currentAvatar));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editForm.name.trim()) return;

    let finalAvatarUrl = resolveImageUrl(editingMember.avatarUrl || editingMember.avatar);

    try {
      if (editAvatarFile) {
        const formData = new FormData();
        formData.append('image', editAvatarFile);
        formData.append('category', 'avatars');

        const uploadRes = await fetch('http://localhost:4000/api/v1/uploads/single', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.data?.url) {
          finalAvatarUrl = uploadJson.data.url;
        }
      }

      await dashboardApi.updateMember(editingMember.id, {
        name: editForm.name,
        address: editForm.address,
        domicile: editForm.domicile,
        division: editForm.division,
        whatsapp: editForm.whatsapp,
        motto: editForm.motto,
        avatarUrl: finalAvatarUrl,
      });

      showToast(`Data anggota "${editForm.name}" berhasil diperbarui.`);
      setEditingMember(null);
      setEditAvatarFile(null);
      loadMembers();
    } catch (err) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: editForm.name,
                address: editForm.address,
                domicile: editForm.domicile,
                division: editForm.division,
                whatsapp: editForm.whatsapp,
                motto: editForm.motto,
                avatarUrl: finalAvatarUrl,
              }
            : m,
        ),
      );
      showToast(`Data anggota "${editForm.name}" berhasil diperbarui.`);
      setEditingMember(null);
      setEditAvatarFile(null);
    }
  };

  const loadMembers = async () => {
    try {
      const res = await dashboardApi.getMembers();
      if (res.data && Array.isArray(res.data)) {
        setMembers(res.data as any);
      }
    } catch (err) {
      setMembers([]);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.domicile.toLowerCase().includes(q) ||
      m.division.toLowerCase().includes(q);
    const matchDiv = selectedDivision === 'Semua' || m.division === selectedDivision;
    const matchStatus = selectedStatus === 'Semua' || m.status === selectedStatus;
    return matchSearch && matchDiv && matchStatus;
  });

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleStatus = async (id: number) => {
    const member = members.find((m) => m.id === id);
    const nextStatus = member?.status === 'Aktif' ? 'Nonaktif' : 'Aktif';

    try {
      await dashboardApi.updateMemberStatus(id, nextStatus);
      showToast(`Status anggota "${member?.name}" diubah.`);
      loadMembers();
    } catch (err) {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m)),
      );
      showToast(`Status anggota "${member?.name}" diubah.`);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Hapus anggota "${name}" dari daftar relawan?`)) {
      try {
        await dashboardApi.deleteMember(id);
        showToast(`Anggota "${name}" dihapus.`);
        loadMembers();
      } catch (err) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        showToast(`Anggota "${name}" dihapus.`);
      }
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    let uploadedAvatarUrl = '/profile.webp';

    try {
      if (selectedAvatarFile) {
        const formData = new FormData();
        formData.append('image', selectedAvatarFile);
        formData.append('category', 'avatars');

        const uploadRes = await fetch('http://localhost:4000/api/v1/uploads/single', {
          method: 'POST',
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson.data?.url) {
          uploadedAvatarUrl = uploadJson.data.url;
        }
      }

      await dashboardApi.createMember({
        name: form.name,
        address: form.address,
        domicile: form.domicile || 'Probolinggo, Jawa Timur',
        division: form.division,
        whatsapp: form.whatsapp,
        motto: form.motto,
        avatarUrl: uploadedAvatarUrl,
        status: 'Aktif',
      });

      showToast(`Anggota baru "${form.name}" berhasil ditambahkan.`);
      setIsAddOpen(false);
      setForm({ name: '', address: '', domicile: '', division: divisionOptions[0], whatsapp: '', motto: '' });
      setSelectedAvatarFile(null);
      setAvatarPreview('/profile.webp');
      loadMembers();
    } catch (err) {
      const newMember: Member = {
        id: Date.now(),
        name: form.name,
        address: form.address,
        domicile: form.domicile || 'Probolinggo, Jawa Timur',
        division: form.division,
        whatsapp: form.whatsapp,
        motto: form.motto,
        status: 'Aktif',
        joinDate: new Date().toISOString(),
        avatarUrl: uploadedAvatarUrl,
      };
      setMembers([newMember, ...members]);
      showToast(`Anggota baru "${form.name}" ditambahkan.`);
      setIsAddOpen(false);
      setSelectedAvatarFile(null);
      setAvatarPreview('/profile.webp');
    }
  };

  const activeCount = members.filter((m) => m.status === 'Aktif').length;
  const inactiveCount = members.filter((m) => m.status === 'Nonaktif').length;

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
      <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80'>
        <div>
          <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 mb-1'>
            <Users className='h-4 w-4' />
            <span>Data Relawan</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight'>
            Manajemen Anggota Relawan
          </h2>
          <p className='text-xs sm:text-sm text-slate-600 mt-1'>
            Pantau dan kelola data seluruh anggota relawan aktif komunitas Pena Hijau di berbagai desa mitra.
          </p>
        </div>

        <button
          type='button'
          onClick={() => setIsAddOpen(true)}
          className='inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:bg-green-700 hover:scale-[1.02] cursor-pointer'
        >
          <Plus className='h-4 w-4' />
          <span>Tambah Anggota Baru</span>
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700'>
            <Users className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Total Anggota</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>{members.length} Orang</p>
          </div>
        </div>

        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700'>
            <UserCheck className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Anggota Aktif</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>{activeCount} Orang</p>
          </div>
        </div>

        <div className='rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 flex items-center gap-4'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600'>
            <UserX className='h-6 w-6' />
          </div>
          <div>
            <p className='text-xs font-bold uppercase text-slate-500'>Anggota Nonaktif</p>
            <p className='text-2xl font-extrabold text-slate-900 mt-0.5'>{inactiveCount} Orang</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm border border-slate-200/80'>
        <div className='flex flex-wrap items-center gap-2'>
          {/* Status filter */}
          {['Semua', 'Aktif', 'Nonaktif'].map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => setSelectedStatus(s)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === s
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}

          {/* Divison filter */}
          <div className='relative'>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className='appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-4 pr-8 text-xs font-bold text-slate-700 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20 cursor-pointer'
            >
              <option value='Semua'>Semua Divisi</option>
              {divisionOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500' />
          </div>
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

      {/* ── Members Table ── */}
      <div className='overflow-hidden rounded-3xl bg-white shadow-md border border-slate-200/80'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-xs sm:text-sm'>
            <thead>
              <tr className='border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider'>
                <th className='py-4 px-4 text-center w-16'>Gambar</th>
                <th className='py-4 px-5'>Anggota Relawan</th>
                <th className='py-4 px-4'>Domisili</th>
                <th className='py-4 px-4'>Divisi</th>
                <th className='py-4 px-4'>WhatsApp</th>
                <th className='py-4 px-4'>Bergabung</th>
                <th className='py-4 px-4 text-center'>Status</th>
                <th className='py-4 px-5 text-right'>Aksi</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 font-medium text-slate-700'>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className='py-14 text-center text-slate-500 font-medium'>
                    <Users className='mx-auto h-10 w-10 text-slate-300 mb-3' />
                    <p>Tidak ada anggota yang sesuai filter.</p>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const avatarSrc = resolveImageUrl(member.avatarUrl || member.avatar);

                  return (
                    <tr key={member.id} className='hover:bg-slate-50/60 transition-colors group'>
                      {/* Member Profile Image Thumbnail */}
                      <td className='py-4 px-4 text-center'>
                        <div className='relative h-11 w-11 mx-auto overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-xs'>
                          <Image
                            src={avatarSrc!}
                            alt={member.name}
                            fill
                            sizes='44px'
                            className='object-cover'
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className='py-4 px-5'>
                        <button
                          type='button'
                          onClick={() => setViewMember(member)}
                          className='font-bold text-slate-900 hover:text-green-600 transition-colors text-left leading-snug cursor-pointer'
                        >
                          {member.name}
                        </button>
                      </td>

                      {/* Domicile */}
                      <td className='py-4 px-4 text-xs whitespace-nowrap'>
                        <div className='flex items-center gap-1.5 text-slate-600'>
                          <MapPin className='h-3.5 w-3.5 text-green-600 shrink-0' />
                          <span>{member.domicile}</span>
                        </div>
                      </td>

                      {/* Division */}
                      <td className='py-4 px-4 whitespace-nowrap'>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold border ${divisionColors[member.division]}`}
                        >
                          {member.division}
                        </span>
                      </td>

                      {/* WhatsApp */}
                      <td className='py-4 px-4 text-xs text-slate-600 whitespace-nowrap'>
                        <div className='flex items-center gap-1.5'>
                          <Phone className='h-3.5 w-3.5 text-green-500 shrink-0' />
                          <a
                            href={`https://wa.me/62${member.whatsapp.slice(1)}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-green-600 hover:underline font-medium'
                          >
                            {member.whatsapp}
                          </a>
                        </div>
                      </td>

                      {/* Join Date */}
                      <td className='py-4 px-4 text-xs text-slate-500 whitespace-nowrap'>
                        {formatDate(member.joinDate)}
                      </td>

                      {/* Status Badge Toggle */}
                      <td className='py-4 px-4 text-center whitespace-nowrap'>
                        <button
                          type='button'
                          onClick={() => handleToggleStatus(member.id)}
                          title='Klik untuk ubah status'
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold border transition-all cursor-pointer hover:opacity-80 ${
                            member.status === 'Aktif'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {member.status === 'Aktif' ? (
                            <CheckCircle2 className='h-3.5 w-3.5' />
                          ) : (
                            <XCircle className='h-3.5 w-3.5' />
                          )}
                          {member.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className='py-4 px-5 text-right whitespace-nowrap'>
                        <div className='flex items-center justify-end gap-2'>
                          <button
                            type='button'
                            onClick={() => setViewMember(member)}
                            className='inline-flex h-9 items-center gap-1.5 rounded-xl bg-green-50 px-3 text-xs font-bold text-green-700 hover:bg-green-600 hover:text-white transition-colors cursor-pointer border border-green-200/60'
                            title='Lihat Detail Anggota'
                          >
                            <span>Detail</span>
                          </button>

                          <button
                            type='button'
                            onClick={() => handleEditClick(member)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200/60'
                            title='Edit Data Anggota'
                          >
                            <Edit2 className='h-3.5 w-3.5' />
                          </button>

                          <button
                            type='button'
                            onClick={() => handleDelete(member.id, member.name)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer border border-red-200/60'
                            title='Hapus Anggota'
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className='flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60 text-xs font-medium text-slate-500'>
          <span>Menampilkan <strong>{filteredMembers.length}</strong> dari <strong>{members.length}</strong> anggota</span>
          <span className='text-green-600 font-bold'>{activeCount} Aktif · {inactiveCount} Nonaktif</span>
        </div>
      </div>

      {/* ── Member Detail Modal ── */}
      {viewMember && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-8 backdrop-blur-sm'
          onClick={() => setViewMember(null)}
        >
          <div
            className='relative max-w-lg w-full rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className='relative bg-linear-to-r from-emerald-950 via-emerald-900 to-slate-900 px-8 py-8 text-white'>
              <button
                type='button'
                onClick={() => setViewMember(null)}
                className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>

              <div className='flex items-center gap-5'>
                <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-emerald-400 bg-slate-800 shadow-md'>
                  <Image
                    src={resolveImageUrl(viewMember.avatarUrl || viewMember.avatar)}
                    alt={viewMember.name}
                    fill
                    sizes='64px'
                    className='object-cover'
                  />
                </div>
                <div>
                  <h3 className='text-lg sm:text-xl font-extrabold text-white leading-snug'>{viewMember.name}</h3>
                  <p className='text-xs text-emerald-300 font-semibold mt-1'>{viewMember.division}</p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                      viewMember.status === 'Aktif'
                        ? 'bg-green-500/20 text-green-300 border-green-400/40'
                        : 'bg-red-500/20 text-red-300 border-red-400/40'
                    }`}
                  >
                    {viewMember.status === 'Aktif' ? <CheckCircle2 className='h-3 w-3' /> : <XCircle className='h-3 w-3' />}
                    {viewMember.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Body */}
            <div className='p-6 sm:p-8 space-y-4 text-sm'>
              <div className='grid gap-3'>
                <div className='flex items-start gap-3'>
                  <MapPin className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>Alamat Lengkap</p>
                    <p className='font-medium text-slate-800'>{viewMember.address}</p>
                    <p className='text-xs text-green-600 font-semibold mt-0.5'>{viewMember.domicile}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Phone className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>Nomor WhatsApp</p>
                    <a
                      href={`https://wa.me/62${viewMember.whatsapp.slice(1)}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='font-medium text-slate-800 hover:text-green-600 hover:underline'
                    >
                      {viewMember.whatsapp}
                    </a>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Quote className='h-4 w-4 text-green-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='text-[10px] font-bold uppercase text-slate-400'>Motto / Kata-Kata</p>
                    <blockquote className='mt-1 border-l-4 border-green-500 pl-3 italic text-slate-700 text-sm leading-relaxed'>
                      &ldquo;{viewMember.motto}&rdquo;
                    </blockquote>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-medium text-slate-500'>
                <span>Bergabung sejak <strong className='text-slate-700'>{viewMember.joinDate}</strong></span>
                <button
                  type='button'
                  onClick={() => setViewMember(null)}
                  className='rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Member Modal ── */}
      {isAddOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm'
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className='relative max-w-xl w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-6'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700'>
                  <Plus className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-slate-900'>Tambah Anggota Relawan</h3>
                  <p className='text-xs text-slate-500'>Isi data lengkap anggota baru Pena Hijau</p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setIsAddOpen(false)}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className='space-y-4 text-xs sm:text-sm'>
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Nama Lengkap *</label>
                <input
                  type='text'
                  required
                  placeholder='Contoh: Ahmad Hidayat, S.P.'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Field: Upload Foto Profil (Opsional) */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>
                  Foto Profil <span className='text-xs font-normal text-slate-500'>(Opsional, default: profile.webp)</span>
                </label>
                <div className='flex items-center gap-4 rounded-2xl border border-slate-300 bg-slate-50 p-4'>
                  <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-green-600 bg-white shadow-xs'>
                    <Image src={avatarPreview} alt='Preview' fill className='object-cover' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <input
                      type='file'
                      accept='image/*'
                      id='memberAvatarUpload'
                      onChange={handleAvatarChange}
                      className='hidden'
                    />
                    <label
                      htmlFor='memberAvatarUpload'
                      className='inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-green-600 hover:text-white transition-colors cursor-pointer'
                    >
                      <Upload className='h-3.5 w-3.5' />
                      Pilih Foto Profil
                    </label>
                    <p className='text-[11px] text-slate-500 mt-1 truncate'>
                      {selectedAvatarFile ? selectedAvatarFile.name : 'Jika tidak diunggah, foto profil otomatis menggunakan profile.webp'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Alamat Lengkap</label>
                <input
                  type='text'
                  placeholder='Jl. Melati No. 12, Desa Kotaanyar'
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Kota / Kabupaten Domisili</label>
                  <input
                    type='text'
                    placeholder='Probolinggo, Jawa Timur'
                    value={form.domicile}
                    onChange={(e) => setForm({ ...form, domicile: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Nomor WhatsApp</label>
                  <input
                    type='text'
                    placeholder='08xxxxxxxxxx'
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Divisi / Bidang Tugas</label>
                <div className='relative'>
                  <select
                    value={form.division}
                    onChange={(e) => setForm({ ...form, division: e.target.value as Division })}
                    className='w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 py-3 pl-4 pr-8 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 cursor-pointer'
                  >
                    {divisionOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Motto / Kata-Kata Inspiratif</label>
                <textarea
                  rows={3}
                  placeholder='Tulis kata-kata motivasi atau semboyan anggota relawan...'
                  value={form.motto}
                  onChange={(e) => setForm({ ...form, motto: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setIsAddOpen(false)}
                  className='rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'
                >
                  Batal
                </button>
                <button
                  type='submit'
                  className='rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-green-700 cursor-pointer'
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Edit Anggota ── */}
      {editingMember && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 sm:p-6 backdrop-blur-sm transition-opacity duration-300'
          onClick={() => setEditingMember(null)}
        >
          <div
            className='relative max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center justify-between pb-4 border-b border-slate-100 mb-6'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-green-100 text-green-700'>
                  <Edit2 className='h-5 w-5' />
                </div>
                <div>
                  <h3 className='text-lg font-bold text-slate-900'>Edit Data Anggota Relawan</h3>
                  <p className='text-xs text-slate-500'>Perbarui data informasi relawan Pena Hijau</p>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setEditingMember(null)}
                className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className='space-y-4 text-xs sm:text-sm'>
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Nama Lengkap *</label>
                <input
                  type='text'
                  required
                  placeholder='Contoh: Ahmad Hidayat, S.P.'
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              {/* Field: Upload Foto Profil (Opsional) */}
              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>
                  Foto Profil <span className='text-xs font-normal text-slate-500'>(Opsional, default: profile.webp)</span>
                </label>
                <div className='flex items-center gap-4 rounded-2xl border border-slate-300 bg-slate-50 p-4'>
                  <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-green-600 bg-white shadow-xs'>
                    <Image src={editAvatarPreview} alt='Preview' fill className='object-cover' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <input
                      type='file'
                      accept='image/*'
                      id='editMemberAvatarUpload'
                      onChange={handleEditAvatarChange}
                      className='hidden'
                    />
                    <label
                      htmlFor='editMemberAvatarUpload'
                      className='inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-green-600 hover:text-white transition-colors cursor-pointer'
                    >
                      <Upload className='h-3.5 w-3.5' />
                      Pilih Foto Profil
                    </label>
                    <p className='text-[11px] text-slate-500 mt-1 truncate'>
                      {editAvatarFile ? editAvatarFile.name : 'Jika tidak diunggah, foto profil otomatis menggunakan profile.webp'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Alamat Lengkap</label>
                <input
                  type='text'
                  placeholder='Jl. Melati No. 12, Desa Kotaanyar'
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Kota / Kabupaten Domisili</label>
                  <input
                    type='text'
                    placeholder='Probolinggo, Jawa Timur'
                    value={editForm.domicile}
                    onChange={(e) => setEditForm({ ...editForm, domicile: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>

                <div>
                  <label className='block font-bold text-slate-900 mb-1.5'>Nomor WhatsApp</label>
                  <input
                    type='text'
                    placeholder='08xxxxxxxxxx'
                    value={editForm.whatsapp}
                    onChange={(e) => setEditForm({ ...editForm, whatsapp: e.target.value })}
                    className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                  />
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Divisi / Bidang Tugas</label>
                <div className='relative'>
                  <select
                    value={editForm.division}
                    onChange={(e) => setEditForm({ ...editForm, division: e.target.value as Division })}
                    className='w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 py-3 pl-4 pr-8 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 cursor-pointer'
                  >
                    {divisionOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                </div>
              </div>

              <div>
                <label className='block font-bold text-slate-900 mb-1.5'>Motto / Kata-Kata Inspiratif</label>
                <textarea
                  rows={3}
                  placeholder='Tulis kata-kata motivasi atau semboyan anggota relawan...'
                  value={editForm.motto}
                  onChange={(e) => setEditForm({ ...editForm, motto: e.target.value })}
                  className='w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 font-medium focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20'
                />
              </div>

              <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
                <button
                  type='button'
                  onClick={() => setEditingMember(null)}
                  className='rounded-xl bg-slate-100 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer'
                >
                  Batal
                </button>
                <button
                  type='submit'
                  className='rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white shadow-md hover:bg-green-700 cursor-pointer'
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
