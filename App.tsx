import React, { useState, useEffect, Suspense } from 'react';
import { Language } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import ROICalculator from './components/ROICalculator';
import { Loader2 } from 'lucide-react';

// Lazy load
const DemoSection = React.lazy(() => import('./components/DemoSection'));
const Process = React.lazy(() => import('./components/Process'));
const CaseStudies = React.lazy(() => import('./components/CaseStudies'));
const TechStack = React.lazy(() => import('./components/TechStack'));
const Testimonials = React.lazy(() => import('./components/Testimonials'));
const FAQ = React.lazy(() => import('./components/FAQ'));
const Contact = React.lazy(() => import('./components/Contact'));
const Footer = React.lazy(() => import('./components/Footer'));
const Chatbot = React.lazy(() => import('./components/Chatbot'));
const WhyUs = React.lazy(() => import('./components/WhyUs'));
const Education = React.lazy(() => import('./components/Education'));
const Login = React.lazy(() => import('./components/Login'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));

interface UserData {
  email: string;
  company: string | null;
  isAdmin?: boolean;
}

function App() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const detectedLang = navigator.language.toLowerCase();
      return detectedLang === 'pl' || detectedLang.startsWith('pl-') ? 'pl' : 'en';
    }
    return 'en';
  });

  const [view, setView] = useState<'home' | 'education' | 'login' | 'dashboard' | 'reset'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'reset') {
      setView('reset');
    }
  }, []);

  const handleNavigate = (newView: 'home' | 'education' | 'login' | 'dashboard') => {
    if (newView === 'dashboard' && !isAuthenticated) {
      setView('login');
    } else {
      setView(newView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // TO JEST NOWA FUNKCJA KTÓRA NAPRAWIA PROBLEM
  const handleNavigateToContact = () => {
    // 1. Zmieniamy widok na stronę główną
    setView('home');
    
    // 2. Czekamy chwilę aż React przerysuje widok i załaduje sekcję Contact
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300); // 300ms opóźnienia, żeby zdążyło się wyrenderować
  };

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setView('home');
  };

  const LoadingFallback = () => (
    <div className="py-20 flex justify-center items-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      <Header 
        lang={lang} 
        setLang={setLang} 
        currentView={view === 'reset' ? 'home' : view} 
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
      />
      
      <main>
        {view === 'home' && (
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
        )}

        {view === 'education' && (
          <Suspense fallback={<LoadingFallback />}>
            {/* PRZEKAZUJEMY NOWĄ FUNKCJĘ DO KOMPONENTU */}
            <Education lang={lang} onNavigateToContact={handleNavigateToContact} />
          </Suspense>
        )}

        {view === 'login' && (
           <Suspense fallback={<LoadingFallback />}>
              <Login lang={lang} onLogin={handleLogin} />
           </Suspense>
        )}

        {view === 'reset' && (
           <Suspense fallback={<LoadingFallback />}>
              <ResetPassword lang={lang} onSuccess={() => setView('login')} />
           </Suspense>
        )}

        {view === 'dashboard' && isAuthenticated && user && (
           <Suspense fallback={<LoadingFallback />}>
              <Dashboard lang={lang} onLogout={handleLogout} userData={user} />
           </Suspense>
        )}
      </main>

      {view !== 'dashboard' && view !== 'login' && view !== 'reset' && (
        <Suspense fallback={null}>
          <Footer lang={lang} />
          <Chatbot lang={lang} />
        </Suspense>
      )}
    </div>
  );
}

export default App;