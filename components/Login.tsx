import React, { useState } from 'react';
import { Language } from '../types';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

interface UserData {
  email: string;
  company: string | null;
}

interface LoginProps {
  lang: Language;
  onLogin: (userData: UserData) => void;
}

const Login: React.FC<LoginProps> = ({ lang, onLogin }) => {
  // Tryb widoku: 'login' (logowanie) lub 'forgot' (reset hasła)
  const [view, setView] = useState<'login' | 'forgot'>('login');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Logowanie
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.inteli-it.com:4443/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Login failed');

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      onLogin(data.user);

    } catch (err: any) {
      setError(lang === 'pl' ? 'Błędny email lub hasło.' : 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Wysyłanie linku resetującego
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('https://api.inteli-it.com:4443/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Zawsze wyświetlamy ten sam komunikat dla bezpieczeństwa (nawet jak maila nie ma w bazie)
      setSuccessMsg(
        lang === 'pl' 
          ? 'Jeśli konto istnieje, wysłaliśmy link resetujący na podany email.' 
          : 'If the account exists, a reset link has been sent.'
      );

    } catch (err) {
      setError(lang === 'pl' ? 'Wystąpił błąd połączenia.' : 'Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
      {/* Tło */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 md:p-10">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {view === 'login' 
                ? (lang === 'pl' ? 'Panel Klienta' : 'Client Panel')
                : (lang === 'pl' ? 'Reset hasła' : 'Reset Password')
              }
            </h1>
            <p className="text-slate-400 text-sm">
              {view === 'login'
                ? (lang === 'pl' ? 'Zaloguj się, aby zarządzać usługami.' : 'Log in to manage services.')
                : (lang === 'pl' ? 'Podaj email, aby odzyskać dostęp.' : 'Enter email to recover access.')
              }
            </p>
          </div>

          {view === 'login' ? (
            // --- FORMULARZ LOGOWANIA ---
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-300 ml-1">
                    {lang === 'pl' ? 'Hasło' : 'Password'}
                  </label>
                  <button 
                    type="button" 
                    onClick={() => { setView('forgot'); setError(null); setSuccessMsg(null); }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {lang === 'pl' ? 'Nie pamiętam hasła' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" /> <span>{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {lang === 'pl' ? 'Zaloguj się' : 'Sign In'} <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            // --- FORMULARZ ZAPOMNIAŁEM HASŁA ---
            <form onSubmit={handleForgot} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm text-center">
                  {successMsg}
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (lang === 'pl' ? 'Wyślij link' : 'Send Link')}
              </button>

              <button 
                type="button" 
                onClick={() => { setView('login'); setError(null); setSuccessMsg(null); }}
                className="w-full text-slate-400 text-sm hover:text-white flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {lang === 'pl' ? 'Wróć do logowania' : 'Back to login'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              {lang === 'pl' ? 'Dostęp tylko dla klientów.' : 'Client access only.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;