'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Images,
  UserPlus,
  Newspaper,
  ArrowUpRight,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';

const DashboardHomePage = () => {
  const [stats, setStats] = useState({
    membersCount: 0,
    galleriesCount: 0,
    pendingRequestsCount: 0,
    articlesCount: 0,
  });

  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [membersRes, galleriesRes, requestsRes, articlesRes] = await Promise.allSettled([
          dashboardApi.getMembers(),
          dashboardApi.getGalleries(),
          dashboardApi.getJoinRequests(),
          dashboardApi.getArticles(),
        ]);

        const members = membersRes.status === 'fulfilled' && Array.isArray(membersRes.value?.data) ? membersRes.value.data : [];
        const galleries = galleriesRes.status === 'fulfilled' && Array.isArray(galleriesRes.value?.data) ? galleriesRes.value.data : [];
        const requests = requestsRes.status === 'fulfilled' && Array.isArray(requestsRes.value?.data) ? requestsRes.value.data : [];
        const articles = articlesRes.status === 'fulfilled' && Array.isArray(articlesRes.value?.data) ? articlesRes.value.data : [];

        const pendingReqs = requests.filter((r: any) => r.status === 'Menunggu');

        setStats({
          membersCount: members.length,
          galleriesCount: galleries.length,
          pendingRequestsCount: pendingReqs.length,
          articlesCount: articles.length,
        });

        setRecentRequests(requests.slice(0, 5));
      } catch (err) {
        // Fallback
      }
    }
    loadDashboardData();
  }, []);

  const statCards = [
    {
      id: 1,
      title: 'Total Anggota Relawan',
      value: stats.membersCount.toString(),
      unit: 'Orang',
      change: 'Terdaftar di Database',
      icon: Users,
      iconBg: 'bg-green-100 text-green-700',
    },
    {
      id: 2,
      title: 'Kegiatan & Event Galeri',
      value: stats.galleriesCount.toString(),
      unit: 'Dokumentasi',
      change: 'Foto Lapangan',
      icon: Images,
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 3,
      title: 'Permintaan Gabung Baru',
      value: stats.pendingRequestsCount.toString(),
      unit: 'Menunggu',
      change: 'Perlu Verifikasi',
      icon: UserPlus,
      iconBg: 'bg-teal-100 text-teal-700',
      badge: stats.pendingRequestsCount > 0 ? 'Perlu Tindakan' : undefined,
    },
    {
      id: 4,
      title: 'Artikel & Pilar Aksi',
      value: stats.articlesCount.toString(),
      unit: 'Publikasi',
      change: 'Terbuka Untuk Umum',
      icon: Newspaper,
      iconBg: 'bg-cyan-100 text-cyan-700',
    },
  ];

  return (
    <div className='space-y-8 p-6 sm:p-8'>
      {/* Welcome Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-linear-to-r from-green-900 via-emerald-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-800/40'>
        <div className='relative z-10 max-w-2xl'>
          <span className='inline-flex items-center rounded-full bg-green-500/20 px-3.5 py-1 text-xs font-bold text-green-300 border border-green-400/30 mb-3'>
            ✨ Panel Admin Terintegrasi API & Firebase
          </span>
          <h1 className='text-2xl sm:text-4xl font-extrabold tracking-tight'>
            Selamat Datang di Sistem Kelola Pena Hijau
          </h1>
          <p className='mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed'>
            Pantau dan kelola seluruh aktivitas relawan, verifikasi pendaftaran baru, dokumentasi foto galeri, serta publikasi berita langsung ke Cloud Firestore.
          </p>
        </div>
      </div>

      {/* Dynamic Stat Cards */}
      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className='relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 transition-all hover:shadow-md hover:-translate-y-0.5'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconBg}`}>
                  <IconComponent className='h-6 w-6' />
                </div>
                {card.badge && (
                  <span className='rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold text-amber-800 border border-amber-200 animate-pulse'>
                    {card.badge}
                  </span>
                )}
              </div>

              <div>
                <p className='text-xs font-medium text-slate-500'>{card.title}</p>
                <div className='mt-1 flex items-baseline gap-2'>
                  <span className='text-3xl font-extrabold text-slate-900 tracking-tight'>{card.value}</span>
                  <span className='text-xs font-bold text-slate-500'>{card.unit}</span>
                </div>
              </div>

              <div className='mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center justify-between'>
                <span>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Requests Table */}
      <div className='rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80 space-y-4'>
        <div className='flex items-center justify-between pb-3 border-b border-slate-100'>
          <div>
            <h3 className='text-base font-bold text-slate-900'>Pendaftaran Relawan Terbaru</h3>
            <p className='text-xs text-slate-500 mt-0.5'>Permintaan yang masuk secara real-time dari formulir pendaftaran website.</p>
          </div>
          <Link
            href='/join-requests'
            className='inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700'
          >
            <span>Lihat Semua</span>
            <ChevronRight className='h-4 w-4' />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className='py-8 text-center text-xs text-slate-500 font-medium'>
            Belum ada pendaftaran relawan baru di dalam sistem database.
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs'>
              <thead>
                <tr className='border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider'>
                  <th className='pb-3 pl-2'>Nama Pendaftar</th>
                  <th className='pb-3'>Domisili</th>
                  <th className='pb-3'>Divisi Minat</th>
                  <th className='pb-3'>Status</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 text-slate-700 font-medium'>
                {recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td className='py-3.5 pl-2 font-bold text-slate-900'>{req.name}</td>
                    <td className='py-3.5'>{req.domicile || req.address}</td>
                    <td className='py-3.5'>{req.divisionInterest}</td>
                    <td className='py-3.5'>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        req.status === 'Diterima' ? 'bg-green-100 text-green-800 border-green-200' :
                        req.status === 'Ditolak' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHomePage;
