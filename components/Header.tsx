import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Globe, UserCircle } from 'lucide-react';
import { Language } from '../types';
import { NAV_ITEMS } from '../constants';
import { ROUTES } from '../routes';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, isAuthenticated = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith(ROUTES.dashboard);
  const isDashboardActive = isDashboard;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isDashboard ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          to={ROUTES.home}
          aria-label={lang === 'pl' ? 'Przejdź do początku strony Inteli-IT' : 'Go to the top of the Inteli-IT page'}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
            I
          </div>
          <span className="text-2xl font-heading font-bold text-white tracking-tight">
            Inteli<span className="text-blue-500">-IT</span>
          </span>
        </Link>

        <nav
          aria-label={lang === 'pl' ? 'Główna nawigacja' : 'Main navigation'}
          className="hidden md:flex items-center gap-8"
        >
          {!isDashboard &&
            NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-300 hover:text-blue-400'
                  }`
                }
              >
                {item.label[lang]}
              </NavLink>
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
            <Link
              to={ROUTES.dashboard}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                isDashboardActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              <UserCircle className="w-4 h-4" />
              {lang === 'pl' ? 'Panel Klienta' : 'Client Panel'}
            </Link>
          ) : (
            <Link
              to={ROUTES.login}
              className="bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors"
            >
              {lang === 'pl' ? 'Logowanie' : 'Log In'}
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/10 hover:border-blue-400"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={
            isOpen
              ? lang === 'pl'
                ? 'Zamknij menu'
                : 'Close menu'
              : lang === 'pl'
                ? 'Otwórz menu'
                : 'Open menu'
          }
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <nav
          aria-label={lang === 'pl' ? 'Nawigacja mobilna' : 'Mobile navigation'}
          className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                `text-lg hover:text-blue-400 ${isActive ? 'text-blue-400' : 'text-slate-300'}`
              }
              onClick={() => setIsOpen(false)}
            >
              {item.label[lang]}
            </NavLink>
          ))}
          <div className="flex gap-4 items-center pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setLang('pl');
                setIsOpen(false);
              }}
              aria-pressed={lang === 'pl'}
              aria-label="Ustaw język strony na polski"
              className={`px-3 py-1 rounded ${lang === 'pl' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              PL
            </button>
            <button
              type="button"
              onClick={() => {
                setLang('en');
                setIsOpen(false);
              }}
              aria-pressed={lang === 'en'}
              aria-label="Set site language to English"
              className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
            >
              EN
            </button>
          </div>
          <Link
            to={isAuthenticated ? ROUTES.dashboard : ROUTES.login}
            onClick={() => setIsOpen(false)}
            className="w-full bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-bold text-center"
          >
            {isAuthenticated ? (lang === 'pl' ? 'Panel Klienta' : 'Client Panel') : lang === 'pl' ? 'Zaloguj się' : 'Log In'}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
