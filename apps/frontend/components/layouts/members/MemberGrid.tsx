'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, Quote, Users, MessageCircle } from 'lucide-react';
import { frontendApi } from '@/lib/api';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  division: string;
  location: string;
  image: string;
  initials?: string | null;
  quote: string;
  whatsapp?: string;
}

const divisions = [
  'Semua',
  'Koordinator Lapangan & Clean-Up',
  'Tim Edukasi & Bank Sampah',
  'Penghijauan & Bibit Pohon',
  'Media & Kampanye Digital',
] as const;

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
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pena-hijau-backend.vercel.app/api/v1';
    const host = rawApiUrl.replace(/\/api\/v1\/?$/, '');
    return `${host}${cleanUrl}`;
  }
  if (cleanUrl.startsWith('/') || cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  return '/profile.webp';
};

const MemberGrid = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedDivision, setSelectedDivision] = useState<string>('Semua');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        setIsLoading(true);
        const res = await frontendApi.getMembers();
        if (res.data && Array.isArray(res.data)) {
          const mapped: TeamMember[] = res.data.map((m: any) => {
            const rawImage = m.avatarUrl || m.avatar;
            const validImage = resolveImageUrl(rawImage);

            return {
              id: m.id,
              name: m.name,
              role: m.division || 'Anggota Relawan',
              division: m.division || 'Relawan',
              location: m.domicile || m.address || 'Jawa Timur',
              image: validImage,
              quote: m.motto || 'Bersama menjaga kelestarian alam.',
              whatsapp: m.whatsapp,
            };
          });
          setMembers(mapped);
        }
      } catch (err) {
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadMembers();
  }, []);

  const filteredMembers =
    selectedDivision === 'Semua'
      ? members
      : members.filter((m) => m.division === selectedDivision || m.role === selectedDivision);

  return (
    <section className='bg-slate-50 py-20 sm:py-28'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        {/* Header Title */}
        <div className='mx-auto max-w-3xl text-center mb-14'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Direktori Relawan
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            Temui Tim Penggerak Pena Hijau
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Generasi muda yang mendedikasikan waktu dan tenaga di berbagai kawasan mitra untuk menjaga kebersihan dan kelestarian alam.
          </p>
        </div>

        {/* Division Filter Tabs */}
        {members.length > 0 && (
          <div className='flex flex-wrap items-center justify-center gap-3 mb-16'>
            {divisions.map((div) => {
              const isActive = selectedDivision === div;
              return (
                <button
                  key={div}
                  type='button'
                  onClick={() => setSelectedDivision(div)}
                  className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-green-600 text-white shadow-lg shadow-green-900/20 scale-105'
                      : 'bg-white text-slate-700 hover:bg-green-50 hover:text-green-600 border border-slate-200'
                  }`}
                >
                  {div}
                </button>
              );
            })}
          </div>
        )}

        {/* Member Cards Grid */}
        {isLoading ? (
          <div className='flex justify-center py-16 items-center'>
            <div className='text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
              <p className='mt-4 text-sm font-semibold text-slate-500'>Memuat data relawan...</p>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className='text-center py-16 rounded-3xl bg-white border border-slate-200/80 max-w-md mx-auto'>
            <Users className='mx-auto h-10 w-10 text-slate-300 mb-3' />
            <p className='text-slate-500 font-medium text-sm'>
              Belum ada data anggota relawan aktif pada divisi ini.
            </p>
          </div>
        ) : (
          <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8'>
            {filteredMembers.map((member) => (
              <article
                key={member.id}
                className='group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-950/10'
              >
                <div>
                  {/* Profile Circular Image Container */}
                  <div className='relative mx-auto h-36 w-36 sm:h-40 sm:w-40 overflow-hidden rounded-full border-[5px] border-green-600 p-1.5 shadow-md shadow-green-900/10 transition-transform duration-500 group-hover:scale-105'>
                    <div className='relative h-full w-full overflow-hidden rounded-full bg-emerald-50'>
                      <Image
                        src={resolveImageUrl(member.image)}
                        alt={member.name}
                        fill
                        sizes='160px'
                        className='object-cover'
                      />
                    </div>
                  </div>

                  {/* Division Tag */}
                  <div className='mt-6 text-center'>
                    <span className='inline-block rounded-full bg-green-100 px-3.5 py-1 text-xs font-bold text-green-700 border border-green-200'>
                      {member.division}
                    </span>
                  </div>

                  {/* Name, Role & Location */}
                  <div className='mt-3 text-center'>
                    <h3 className='text-xl font-bold text-slate-900 group-hover:text-green-600 transition-colors leading-snug'>
                      {member.name}
                    </h3>
                    <p className='mt-1 text-xs sm:text-sm font-semibold text-slate-500'>
                      {member.role}
                    </p>
                    <p className='mt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500'>
                      <MapPin className='h-3.5 w-3.5 text-green-600 shrink-0' />
                      <span>{member.location}</span>
                    </p>
                  </div>

                  {/* Motto Quote Box */}
                  <div className='mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100 relative'>
                    <Quote className='h-4 w-4 text-green-600/30 absolute top-2.5 left-2.5' />
                    <p className='text-xs leading-relaxed text-slate-600 italic pl-3.5'>
                      &ldquo;{member.quote}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Footer WhatsApp Link */}
                {member.whatsapp && (
                  <div className='mt-6 pt-4 border-t border-slate-100 flex justify-center'>
                    <a
                      href={`https://wa.me/${member.whatsapp.replace(/[^0-9]/g, '')}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-600 hover:text-white transition-colors'
                    >
                      <MessageCircle className='h-4 w-4' />
                      <span>Hubungi WhatsApp</span>
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MemberGrid;
