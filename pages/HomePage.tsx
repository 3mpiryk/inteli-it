import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Language } from '../types';
import { HomeSectionId } from '../routes';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ROICalculator from '../components/ROICalculator';

const DemoSection = React.lazy(() => import('../components/DemoSection'));
const Process = React.lazy(() => import('../components/Process'));
const CaseStudies = React.lazy(() => import('../components/CaseStudies'));
const TechStack = React.lazy(() => import('../components/TechStack'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const FAQ = React.lazy(() => import('../components/FAQ'));
const Contact = React.lazy(() => import('../components/Contact'));
const WhyUs = React.lazy(() => import('../components/WhyUs'));

interface HomePageProps {
  lang: Language;
  initialSectionId?: HomeSectionId;
}

const scrollToSection = (sectionId: string) => {
  let attempts = 0;
  const maxAttempts = 12;

  const tryScroll = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    attempts += 1;
    if (attempts <= maxAttempts) {
      setTimeout(tryScroll, 120);
    }
  };

  tryScroll();
};

const LoadingFallback = () => (
  <div className="py-20 flex justify-center items-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ lang, initialSectionId }) => {
  const location = useLocation();

  useEffect(() => {
    const hashTarget = location.hash ? location.hash.replace('#', '') : '';
    const target = initialSectionId || hashTarget;

    if (!target) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    scrollToSection(target);
  }, [initialSectionId, location.hash]);

  return (
    <>
      <Hero lang={lang} />
      <Services lang={lang} />
      <ROICalculator lang={lang} />
      <Suspense fallback={<LoadingFallback />}>
        <WhyUs lang={lang} />
        <DemoSection lang={lang} />
        <Process lang={lang} />
        <CaseStudies lang={lang} />
        <TechStack lang={lang} />
        <Testimonials lang={lang} />
        <FAQ lang={lang} />
        <Contact lang={lang} />
      </Suspense>
    </>
  );
};

export default HomePage;
