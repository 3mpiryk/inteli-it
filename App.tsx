import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Language } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import { HOME_SECTIONS, ROUTES } from './routes';
import { applySeo } from './seo';

const Education = React.lazy(() => import('./components/Education'));
const Login = React.lazy(() => import('./components/Login'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));
const Footer = React.lazy(() => import('./components/Footer'));
const Chatbot = React.lazy(() => import('./components/Chatbot'));

interface UserData {
  email: string;
  company: string | null;
  isAdmin?: boolean;
}

const LoadingFallback = () => (
  <div className="py-20 flex justify-center items-center min-h-[50vh]">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
  </div>
);

function App() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const detectedLang = navigator.language.toLowerCase();
      return detectedLang === 'pl' || detectedLang.startsWith('pl-') ? 'pl' : 'en';
    }
    return 'en';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname === ROUTES.home && params.get('view') === 'reset') {
      params.delete('view');
      const rest = params.toString();
      navigate(`${ROUTES.reset}${rest ? `?${rest}` : ''}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    applySeo(location.pathname, lang);
  }, [location.pathname, lang]);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setIsAuthenticated(true);
    navigate(ROUTES.dashboard);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate(ROUTES.home);
  };

  const hideFooter =
    location.pathname.startsWith(ROUTES.dashboard) ||
    location.pathname.startsWith(ROUTES.login) ||
    location.pathname.startsWith(ROUTES.reset);

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-blue-500 selection:text-white">
      <Header
        lang={lang}
        setLang={setLang}
        isAuthenticated={isAuthenticated}
      />

      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage lang={lang} />} />
            <Route
              path={ROUTES.services}
              element={<HomePage lang={lang} initialSectionId={HOME_SECTIONS.services} />}
            />
            <Route
              path={ROUTES.process}
              element={<HomePage lang={lang} initialSectionId={HOME_SECTIONS.process} />}
            />
            <Route
              path={ROUTES.demo}
              element={<HomePage lang={lang} initialSectionId={HOME_SECTIONS.demo} />}
            />
            <Route
              path={ROUTES.caseStudies}
              element={<HomePage lang={lang} initialSectionId={HOME_SECTIONS.caseStudies} />}
            />
            <Route
              path={ROUTES.contact}
              element={<HomePage lang={lang} initialSectionId={HOME_SECTIONS.contact} />}
            />
            <Route path={ROUTES.education} element={<Education lang={lang} />} />
            <Route
              path={ROUTES.login}
              element={
                isAuthenticated ? (
                  <Navigate to={ROUTES.dashboard} replace />
                ) : (
                  <Login lang={lang} onLogin={handleLogin} />
                )
              }
            />
            <Route path={ROUTES.reset} element={<ResetPassword lang={lang} onSuccess={() => navigate(ROUTES.login, { replace: true })} />} />
            <Route
              path={ROUTES.dashboard}
              element={
                isAuthenticated && user ? (
                  <Dashboard lang={lang} onLogout={handleLogout} userData={user} />
                ) : (
                  <Navigate to={ROUTES.login} replace />
                )
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Routes>
        </Suspense>
      </main>

      {!hideFooter && (
        <Suspense fallback={null}>
          <Footer lang={lang} />
          <Chatbot lang={lang} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
