const missions = ['Membangun kesadaran masyarakat tentang pentingnya menjaga lingkungan.', 'Mengajak generasi muda aktif dalam aksi peduli sampah dan penghijauan.', 'Menciptakan program lingkungan yang edukatif, konsisten, dan berdampak.'];

const VisionMissionSection = () => {
  return (
    <section className='bg-white py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-sm font-semibold uppercase tracking-[0.25em] text-green-600'>Visi & Misi</p>
          <h2 className='mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl'>Bersama Menjaga Bumi, Mulai dari Langkah Kecil</h2>
          <p className='mt-5 text-base leading-8 text-slate-600 sm:text-lg'>Pena Hijau hadir sebagai ruang kolaborasi untuk membangun kebiasaan peduli lingkungan melalui edukasi, aksi nyata, dan kepedulian sosial.</p>
        </div>

        <div className='mt-14 grid gap-6 lg:grid-cols-2'>
          <div className='rounded-3xl bg-green-600 p-8 text-white shadow-lg shadow-green-900/10 sm:p-10'>
            <span className='inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur'>Visi</span>
            <h3 className='mt-6 text-2xl font-bold'>Menjadi gerakan hijau yang berdampak.</h3>
            <p className='mt-4 leading-8 text-green-50'>Mewujudkan generasi yang peduli, aktif, dan bertanggung jawab dalam menjaga kelestarian lingkungan untuk masa depan yang lebih sehat.</p>
          </div>

          <div className='rounded-3xl border border-green-100 bg-green-50 p-8 shadow-sm sm:p-10'>
            <span className='inline-flex rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white'>Misi</span>
            <ul className='mt-6 space-y-4'>
              {missions.map((mission, index) => (
                <li
                  key={mission}
                  className='flex gap-4 text-slate-700'
                >
                  <span className='mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white'>{index + 1}</span>
                  <span className='leading-7'>{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
