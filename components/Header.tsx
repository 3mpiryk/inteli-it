
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, UserCircle } from 'lucide-react';
import { Language } from '../types';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  currentView: 'home' | 'education' | 'dashboard' | 'login';
  onNavigate: (view: 'home' | 'education' | 'dashboard' | 'login') => void;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, currentView, onNavigate, isAuthenticated = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof NAV_ITEMS[0]) => {
    if (item.isPage) {
      e.preventDefault();
      onNavigate('education');
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If we are on education or dashboard page and click a home link (anchor), go home first
      if ((currentView === 'education' || currentView === 'dashboard' || currentView === 'login') && item.href.startsWith('#')) {
        e.preventDefault();
        onNavigate('home');
        setIsOpen(false);
        // Wait for render then scroll
        setTimeout(() => {
          const element = document.querySelector(item.href);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setIsOpen(false);
      }
    }
  };

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || currentView === 'dashboard' ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a
          href="#"
          onClick={goHome}
          aria-label={lang === 'pl' ? 'Przejdź do początku strony Inteli-IT' : 'Go to the top of the Inteli-IT page'}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
            I
          </div>
          <span className="text-2xl font-heading font-bold text-white tracking-tight">
            Inteli<span className="text-blue-500">-IT</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav
          aria-label={lang === 'pl' ? 'Główna nawigacja' : 'Main navigation'}
          className="hidden md:flex items-center gap-8"
        >
          {/* Hide main nav items when in dashboard to keep it clean, OR keep them to allow easy exit */}
          {currentView !== 'dashboard' && NAV_ITEMS.map((item) => (
            <a 
              key={item.href} 
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`text-sm font-medium transition-colors ${
                (item.isPage && currentView === 'education') ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'
              }`}
            >
              {item.label[lang]}
            </a>
          ))}
          
          <div className="h-6 w-px bg-slate-700 mx-2"></div>
          
          <button 
            type="button"
            onClick={() => setLang(lang === 'pl' ? 'en' : 'pl')}
            aria-label={lang === 'pl' ? 'Zmień język strony na angielski' : 'Switch site language to Polish'}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className={`text-sm font-bold ${lang === 'pl' ? 'text-blue-400' : ''}`}>PL</span>
            <span className="text-slate-600">|</span>
            <span className={`text-sm font-bold ${lang === 'en' ? 'text-blue-400' : ''}`}>EN</span>
          </button>

          {isAuthenticated ? (
             <button 
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-colors ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
             >
                <UserCircle className="w-4 h-4" />
                {lang === 'pl' ? 'Panel Klienta' : 'Client Panel'}
             </button>
          ) : (
            <button 
               onClick={() => onNavigate('login')}
               className="bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors"
            >
               {lang === 'pl' ? 'Logowanie' : 'Log In'}
            </button>
          )}

        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/10 hover:border-blue-400"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? (lang === 'pl' ? 'Zamknij menu' : 'Close menu') : (lang === 'pl' ? 'Otwórz menu' : 'Open menu')}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav
          aria-label={lang === 'pl' ? 'Nawigacja mobilna' : 'Mobile navigation'}
          className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl"
        >
          {NAV_ITEMS.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              className={`text-lg hover:text-blue-400 ${
                 (item.isPage && currentView === 'education') ? 'text-blue-400' : 'text-slate-300'
              }`}
              onClick={(e) => handleNavClick(e, item)}
            >
              {item.label[lang]}
            </a>
          ))}
          <div className="flex gap-4 items-center pt-4 border-t border-slate-800">
             <button 
                type="button"
                onClick={() => { setLang('pl'); setIsOpen(false); }}
                aria-pressed={lang === 'pl'}
                aria-label="Ustaw język strony na polski"
                className={`px-3 py-1 rounded ${lang === 'pl' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                PL
              </button>
              <button 
                type="button"
                onClick={() => { setLang('en'); setIsOpen(false); }}
                aria-pressed={lang === 'en'}
                aria-label="Set site language to English"
                className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
              >
                EN
              </button>
          </div>
          <button 
             onClick={() => { 
                onNavigate(isAuthenticated ? 'dashboard' : 'login'); 
                setIsOpen(false); 
             }}
             className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-bold"
          >
             {isAuthenticated ? (lang === 'pl' ? 'Panel Klienta' : 'Client Panel') : (lang === 'pl' ? 'Zaloguj się' : 'Log In')}
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
