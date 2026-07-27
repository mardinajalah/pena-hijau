import MemberHero from '../layouts/members/MemberHero';
import MemberGrid from '../layouts/members/MemberGrid';
import MemberBenefits from '../layouts/members/MemberBenefits';
import MemberCta from '../layouts/members/MemberCta';

const MemberPage = () => {
  return (
    <div className='w-full overflow-hidden bg-slate-50'>
      {/* 1. Hero Section Anggota & Relawan */}
      <MemberHero />

      {/* 2. Grid Anggota & Filter Divisi */}
      <MemberGrid />

      {/* 3. Manfaat & Keuntungan Relawan */}
      <MemberBenefits />

      {/* 4. Call To Action Pendaftaran */}
      <MemberCta />
    </div>
  );
};

export default MemberPage;
