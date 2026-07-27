import AboutHero from '../layouts/about/AboutHero';
import AboutStory from '../layouts/about/AboutStory';
import VisionMissionSection from '../layouts/VisionMissionSection';
import AboutValues from '../layouts/about/AboutValues';
import AboutStats from '../layouts/about/AboutStats';
import MemberSection from '../layouts/MemberSection';
import AboutCta from '../layouts/about/AboutCta';

const AboutPage = () => {
  return (
    <div className='w-full overflow-hidden bg-slate-50'>
      {/* 1. Hero Banner Tentang Kami */}
      <AboutHero />

      {/* 2. Sejarah & Latar Belakang */}
      <AboutStory />

      {/* 3. Visi & Misi */}
      <VisionMissionSection />

      {/* 4. Nilai-Nilai Utama */}
      <AboutValues />

      {/* 5. Statistik & Capaian Dampak */}
      <AboutStats />

      {/* 6. Tim & Anggota Penggerak */}
      <MemberSection />

      {/* 7. Call To Action Penutup */}
      <AboutCta />
    </div>
  );
};

export default AboutPage;