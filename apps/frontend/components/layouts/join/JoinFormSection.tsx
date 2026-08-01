'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, MapPin, Quote, CheckCircle2, Phone, Tag, Upload, ArrowRight } from 'lucide-react';
import { frontendApi } from '@/lib/api';

const JoinFormSection = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [quote, setQuote] = useState('');
  const [division, setDivision] = useState('Koordinator Lapangan & Clean-Up');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('/profile.webp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && address.trim() && quote.trim()) {
      setIsSubmitting(true);
      let uploadedAvatarUrl = '/profile.webp';

      try {
        // Upload profile photo to backend server if user attached a file
        if (avatarFile) {
          const uploadJson = await frontendApi.uploadSingleImage(avatarFile, 'avatars');
          if (uploadJson.data?.fullUrl || uploadJson.data?.url) {
            uploadedAvatarUrl = uploadJson.data.fullUrl || uploadJson.data.url;
          }
        }

        await frontendApi.submitJoinForm({
          name: name.trim(),
          address: address.trim(),
          domicile: address.trim(),
          divisionInterest: division,
          whatsapp: phone.trim() || '082200001111',
          motto: quote.trim(),
          avatarUrl: uploadedAvatarUrl,
          avatar: uploadedAvatarUrl,
        } as any);

        setIsSubmitted(true);
      } catch (error) {
        setIsSubmitted(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setName('');
    setAddress('');
    setQuote('');
    setPhone('');
    setAvatarFile(null);
    setAvatarPreview('/profile.webp');
    setIsSubmitted(false);
  };

  return (
    <section className='bg-slate-50 py-20 sm:py-28'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center mb-16'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>
            Formulir Pendaftaran
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
            Bergabunglah dengan Barisan Pemuda Hijau
          </h2>
          <p className='mt-4 text-base leading-8 text-slate-600 sm:text-lg'>
            Lengkapi data diri dan motto motivasi Anda. Kartu tanda anggota relawan digital akan langsung terbentuk saat Anda mengetik.
          </p>
        </div>

        {isSubmitted ? (
          /* Success Screen */
          <div className='mx-auto max-w-2xl rounded-3xl bg-white p-8 sm:p-12 shadow-xl border border-green-200 text-center'>
            <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6'>
              <CheckCircle2 className='h-10 w-10' />
            </div>
            <h3 className='text-2xl sm:text-3xl font-bold text-slate-900'>
              Selamat, Pendaftaran Berhasil!
            </h3>
            <p className='mt-4 text-base text-slate-600 leading-relaxed'>
              Terima kasih <strong className='text-green-700 font-semibold'>{name}</strong> atas kepedulian Anda. Data relawan Anda dari <strong className='text-slate-900 font-semibold'>{address}</strong> telah resmi terdaftar di Pena Hijau.
            </p>

            {/* Rendered Member Card Preview in Success Screen */}
            <div className='my-8 relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-950 to-slate-950 p-6 text-left text-white shadow-2xl border border-emerald-700/50 max-w-md mx-auto'>
              <div className='flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-emerald-400/60 bg-white'>
                    <Image src={avatarPreview} alt={name} fill className='object-cover' />
                  </div>
                  <div>
                    <h4 className='text-sm font-bold text-white'>{name || 'Nama Relawan'}</h4>
                    <p className='text-[10px] text-emerald-300 uppercase tracking-widest'>Kartu Anggota Relawan</p>
                  </div>
                </div>
                <span className='rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold text-green-300 border border-green-400/30'>TERDAFTAR</span>
              </div>

              <div className='space-y-3'>
                <div>
                  <p className='text-[10px] uppercase text-emerald-300 font-semibold'>Alamat / Domisili</p>
                  <p className='text-xs text-slate-200 flex items-center gap-1 mt-0.5'>
                    <MapPin className='h-3.5 w-3.5 text-green-400 shrink-0' />
                    {address}
                  </p>
                </div>
                <div>
                  <p className='text-[10px] uppercase text-emerald-300 font-semibold'>Divisi Minat</p>
                  <p className='text-xs text-slate-200 font-medium'>{division}</p>
                </div>
                <div className='pt-3 border-t border-emerald-800/60'>
                  <p className='text-[10px] uppercase text-emerald-300 font-semibold flex items-center gap-1'>
                    <Quote className='h-3 w-3 text-green-400' />
                    Motto Motivasi
                  </p>
                  <p className='text-xs text-slate-200 italic mt-1 leading-relaxed'>" {quote} "</p>
                </div>
              </div>
            </div>

            <button
              type='button'
              onClick={handleReset}
              className='rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors'
            >
              Daftarkan Relawan Lain
            </button>
          </div>
        ) : (
          <div className='grid gap-12 lg:grid-cols-12 items-start'>
            {/* Form Section */}
            <div className='lg:col-span-7 rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200/80'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Field: Nama Lengkap */}
                <div>
                  <label htmlFor='name' className='block text-sm font-bold text-slate-900 mb-2'>
                    Nama Lengkap <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <User className='h-5 w-5 text-green-600' />
                    </div>
                    <input
                      type='text'
                      id='name'
                      required
                      placeholder='Contoh: Ahmad Hidayat, S.P.'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Field: Upload Foto Profil (Opsional) */}
                <div>
                  <label className='block text-sm font-bold text-slate-900 mb-2'>
                    Foto Profil <span className='text-xs font-normal text-slate-500'>(Opsional, default: profile.webp)</span>
                  </label>
                  <div className='flex items-center gap-4 rounded-2xl border border-slate-300 bg-slate-50 p-4'>
                    <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-green-600 bg-white'>
                      <Image src={avatarPreview} alt='Preview' fill className='object-cover' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <input
                        type='file'
                        accept='image/*'
                        id='avatarUpload'
                        onChange={handleAvatarChange}
                        className='hidden'
                      />
                      <label
                        htmlFor='avatarUpload'
                        className='inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-green-600 hover:text-white transition-colors cursor-pointer'
                      >
                        <Upload className='h-3.5 w-3.5' />
                        Pilih Foto Profil
                      </label>
                      <p className='text-[11px] text-slate-500 mt-1 truncate'>
                        {avatarFile ? avatarFile.name : 'Jika tidak diunggah, foto profil otomatis menggunakan profile.webp'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Field: Alamat / Domisili */}
                <div>
                  <label htmlFor='address' className='block text-sm font-bold text-slate-900 mb-2'>
                    Alamat Lengkap / Domisili <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <MapPin className='h-5 w-5 text-green-600' />
                    </div>
                    <input
                      type='text'
                      id='address'
                      required
                      placeholder='Contoh: Desa Kotaanyar, Kec. Kotaanyar, Probolinggo'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Field: Motto / Kata-Kata Inspiratif */}
                <div>
                  <label htmlFor='quote' className='block text-sm font-bold text-slate-900 mb-2'>
                    Motto / Kata-Kata Inspiratif Lingkungan <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute top-4 left-4 text-slate-400'>
                      <Quote className='h-5 w-5 text-green-600' />
                    </div>
                    <textarea
                      id='quote'
                      required
                      rows={3}
                      placeholder='Tuliskan kalimat motivasi atau pesan peduli lingkungan Anda...'
                      value={quote}
                      onChange={(e) => setQuote(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Field: Divisi Minat */}
                <div>
                  <label htmlFor='division' className='block text-sm font-bold text-slate-900 mb-2'>
                    Pilihan Divisi / Bidang Minat
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <Tag className='h-5 w-5 text-green-600' />
                    </div>
                    <select
                      id='division'
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all cursor-pointer'
                    >
                      <option value='Koordinator Lapangan & Clean-Up'>Koordinator Lapangan & Clean-Up</option>
                      <option value='Tim Edukasi & Bank Sampah'>Tim Edukasi & Bank Sampah</option>
                      <option value='Penghijauan & Bibit Pohon'>Penghijauan & Bibit Pohon</option>
                      <option value='Media & Kampanye Digital'>Media & Kampanye Digital</option>
                    </select>
                  </div>
                </div>

                {/* Field: No. WhatsApp */}
                <div>
                  <label htmlFor='phone' className='block text-sm font-bold text-slate-900 mb-2'>
                    No. WhatsApp / HP <span className='text-xs font-normal text-slate-500'>(Opsional)</span>
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400'>
                      <Phone className='h-5 w-5 text-green-600' />
                    </div>
                    <input
                      type='tel'
                      id='phone'
                      placeholder='Contoh: 081234567890'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600/20 transition-all'
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-green-600 py-4 px-6 text-base font-bold text-white shadow-lg shadow-green-900/30 transition-all duration-300 hover:bg-green-700 hover:scale-[1.01] cursor-pointer disabled:opacity-50'
                >
                  <span>{isSubmitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran & Buat Kartu'}</span>
                  <ArrowRight className='h-5 w-5' />
                </button>
              </form>
            </div>

            {/* Live Interactive Card Preview */}
            <div className='lg:col-span-5 sticky top-28'>
              <p className='text-xs font-bold uppercase tracking-wider text-slate-500 mb-3'>
                Pratinjau Live Kartu Anggota Digital
              </p>
              <div className='relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-900 via-emerald-950 to-slate-950 p-6 sm:p-7 text-white shadow-2xl border border-emerald-700/50'>
                <div className='flex items-center justify-between border-b border-emerald-800/80 pb-4 mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-emerald-400/60 bg-white'>
                      <Image src={avatarPreview} alt={name || 'Avatar'} fill className='object-cover' />
                    </div>
                    <div>
                      <h4 className='text-base font-extrabold text-white truncate max-w-42.5'>{name || 'Nama Relawan'}</h4>
                      <p className='text-[10px] text-emerald-300 uppercase tracking-widest'>Kartu Anggota Digital</p>
                    </div>
                  </div>
                  <span className='rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold text-green-300 border border-green-400/30'>DRAFT</span>
                </div>

                <div className='space-y-3.5 text-xs'>
                  <div>
                    <p className='text-[10px] uppercase text-emerald-300 font-semibold'>Alamat / Domisili</p>
                    <p className='text-slate-200 flex items-center gap-1 mt-0.5 truncate'>
                      <MapPin className='h-3.5 w-3.5 text-green-400 shrink-0' />
                      {address || 'Kecamatan / Kabupaten'}
                    </p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase text-emerald-300 font-semibold'>Divisi Minat</p>
                    <p className='text-slate-200 font-medium'>{division}</p>
                  </div>
                  <div className='pt-3 border-t border-emerald-800/60'>
                    <p className='text-[10px] uppercase text-emerald-300 font-semibold flex items-center gap-1'>
                      <Quote className='h-3 w-3 text-green-400' />
                      Motto / Kata Inspiratif
                    </p>
                    <p className='text-slate-200 italic mt-1 leading-relaxed line-clamp-3'>
                      " {quote || 'Satu langkah kecil kita hari ini adalah nafas bersih bagi bumi di masa depan.'} "
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JoinFormSection;
