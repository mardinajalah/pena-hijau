'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { frontendApi } from '@/lib/api';

interface MemberItem {
  id: number;
  name: string;
  role: string;
  image: string;
}

const socialLinks = [
  {
    label: 'Facebook',
    Icon: FaFacebookF,
  },
  {
    label: 'Instagram',
    Icon: FaInstagram,
  },
  {
    label: 'LinkedIn',
    Icon: FaLinkedinIn,
  },
];

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

const MemberSection = () => {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        setIsLoading(true);
        const res = await frontendApi.getMembers();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const seenCategories = new Set<string>();
          const filtered: MemberItem[] = [];

          for (const m of res.data) {
            const category = m.division || m.category || 'Relawan';
            if (!seenCategories.has(category)) {
              seenCategories.add(category);
              filtered.push({
                id: m.id,
                name: m.name,
                role: category,
                image: resolveImageUrl(m.avatarUrl || m.avatar),
              });
            }
            if (filtered.length >= 4) break;
          }

          setMembers(filtered);
        } else {
          setMembers([]);
        }
      } catch (err) {
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadMembers();
  }, []);

  return (
    <section className='bg-white py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Anggota & Penggerak</p>
          <h2 className='mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Tim Penggerak Pena Hijau</h2>
          <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>Orang-orang berdedikasi di balik kegiatan edukasi, aksi bersih lingkungan, dan kolaborasi desa bersama Pena Hijau.</p>
        </div>

        {isLoading ? (
          <div className='flex justify-center py-16 items-center'>
            <div className='text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
              <p className='mt-4 text-sm font-semibold text-slate-500'>Memuat tim penggerak...</p>
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className='text-center py-12 rounded-3xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto mt-16'>
            <p className='text-slate-500 font-medium text-sm'>
              Belum ada data tim penggerak yang tersedia.
            </p>
          </div>
        ) : (
          <div className='mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4'>
            {members.map((member) => (
              <article
                key={member.id}
                className='text-center group'
              >
                <div className='mx-auto flex h-48 w-48 items-center justify-center rounded-full border-[6px] border-green-600 p-2 shadow-lg shadow-green-900/10 transition-transform duration-300 group-hover:scale-105'>
                  <div className='relative h-full w-full overflow-hidden rounded-full bg-green-50'>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes='192px'
                      className='object-cover'
                    />
                  </div>
                </div>

                <h3 className='mt-6 text-xl font-bold text-slate-950 group-hover:text-green-600 transition-colors'>{member.name}</h3>
                <p className='mt-2 text-sm text-slate-600 font-medium'>{member.role}</p>

                <div className='mt-4 flex justify-center gap-4 text-green-600'>
                  {socialLinks.map(({ label, Icon }) => (
                    <a
                      key={`${member.name}-${label}`}
                      href='#'
                      aria-label={`${label} ${member.name}`}
                      className='text-lg transition-colors hover:text-green-700'
                    >
                      <Icon aria-hidden='true' />
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MemberSection;
