import HeroSection from '../layouts/HeroSection';
import HomeAboutSection from '../layouts/HomeAboutSection';
import AboutPillars from '../layouts/about/AboutPillars';
import GallerySection from '../layouts/GallerySection';
import TestimonialSection from '../layouts/TestimonialSection';
import HomeCta from '../layouts/HomeCta';

const HomePage = () => {
  return (
    <div className='w-full overflow-hidden bg-slate-50'>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Short About Teaser Section */}
      <HomeAboutSection />

      {/* 3. Program & Activity Pillars */}
      <AboutPillars />

      {/* 4. Interactive Activity Gallery */}
      <GallerySection />

      {/* 5. Community Testimonials & Voices */}
      <TestimonialSection />

      {/* 6. Homepage Specific Call To Action */}
      <HomeCta />
    </div>
  );
};

export default HomePage;
