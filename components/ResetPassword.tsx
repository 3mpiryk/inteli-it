import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface ResetProps {
  lang: Language;
  onSuccess: () => void; // Funkcja przekierowująca do logowania po sukcesie
}

const ResetPassword: React.FC<ResetProps> = ({ lang, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pobierz token z adresu URL przy załadowaniu
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError(lang === 'pl' ? 'Brak tokena resetującego.' : 'Missing reset token.');
    }
  }, [lang]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(lang === 'pl' ? 'Hasła nie są identyczne.' : 'Passwords do not match.');
      return;
    }

    if (!token) return;

    setIsLoading(true);

    try {
      const response = await fetch('https://api.inteli-it.com:4443/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Błąd resetowania');
      }

      setSuccess(true);
      // Po 2 sekundach przekieruj do logowania
      setTimeout(() => {
        // Czyścimy URL z parametrów
        window.history.replaceState({}, document.title, "/");
        onSuccess();
      }, 2500);

    } catch (err: any) {
      setError(lang === 'pl' ? err.message : 'Error resetting password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-slate-950 px-6 relative overflow-hidden">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10 p-8 md:p-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {lang === 'pl' ? 'Ustaw nowe hasło' : 'Set New Password'}
          </h1>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8" />
              <p>{lang === 'pl' ? 'Hasło zostało zmienione!' : 'Password changed!'}</p>
            </div>
            <p className="text-slate-400 text-sm">
              {lang === 'pl' ? 'Przekierowywanie do logowania...' : 'Redirecting to login...'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">
                {lang === 'pl' ? 'Nowe hasło' : 'New Password'}
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">
                {lang === 'pl' ? 'Potwierdź hasło' : 'Confirm Password'}
              </label>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" /> <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {lang === 'pl' ? 'Zmień hasło' : 'Reset Password'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;