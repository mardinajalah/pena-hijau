'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, MapPin, Quote, User } from 'lucide-react';
import { frontendApi } from '@/lib/api';

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  division: string;
  location: string;
  image: string;
  quote: string;
  whatsapp?: string;
}

const fallbackMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Ahmad Hidayat, S.P.',
    role: 'Koordinator Lapangan',
    division: 'Koordinator Lapangan & Clean-Up',
    location: 'Probolinggo, Jawa Timur',
    image: '/profile.webp',
    quote: 'Alam yang sehat adalah warisan terbaik untuk generasi mendatang.',
    whatsapp: '082233441122',
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    role: 'Tim Edukasi & Bank Sampah',
    division: 'Tim Edukasi & Bank Sampah',
    location: 'Probolinggo, Jawa Timur',
    image: '/profile.webp',
    quote: 'Edukasi adalah kunci perubahan lingkungan yang berkelanjutan.',
    whatsapp: '085678901234',
  },
];

const MemberGrid = () => {
  const [members, setMembers] = useState<TeamMember[]>(fallbackMembers);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await frontendApi.getMembers();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: TeamMember[] = res.data.map((m: any) => ({
            id: m.id,
            name: m.name,
            role: m.division || 'Anggota Relawan',
            division: m.division || 'Relawan',
            location: m.domicile || m.address || 'Jawa Timur',
            image: m.avatarUrl || '/profile.webp',
            quote: m.motto || 'Bersama menjaga kelestarian alam.',
            whatsapp: m.whatsapp,
          }));
          setMembers(mapped);
        }
      } catch (err) {
        // Fallback
      }
    }
    loadMembers();
  }, []);

  return (
    <section className='bg-slate-50 py-20 sm:py-28'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center mb-16'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Direktori Relawan</p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Anggota Aktif Komunitas Pena Hijau</h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Generasi muda yang mendedikasikan waktu dan tenaga di berbagai kawasan mitra untuk menjaga kebersihan dan kelestarian alam.
          </p>
        </div>

        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {members.map((member) => (
            <div
              key={member.id}
              className='group flex flex-col overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-green-900/10 border border-slate-100'
            >
              <div className='flex items-center gap-5 mb-6'>
                <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 text-white font-extrabold flex items-center justify-center shadow-md'>
                  {member.image && member.image.startsWith('/') && !member.image.includes('profile') ? (
                    <Image src={member.image} alt={member.name} fill sizes='64px' className='object-cover' />
                  ) : (
                    <span className='text-xl'>
                      {member.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className='text-lg font-bold text-slate-900 leading-snug group-hover:text-green-700 transition-colors'>
                    {member.name}
                  </h3>
                  <span className='mt-1 inline-flex items-center rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200'>
                    {member.role}
                  </span>
                </div>
              </div>

              <div className='flex-1 space-y-4 text-xs sm:text-sm text-slate-600'>
                <div className='flex items-center gap-2 text-green-700 font-semibold'>
                  <MapPin className='h-4 w-4 shrink-0' />
                  <span>{member.location}</span>
                </div>

                <blockquote className='border-l-4 border-green-500 pl-3 italic text-slate-700 leading-relaxed'>
                  &ldquo;{member.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MemberGrid;
