import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import { Language } from '../types';
import { ROUTES } from '../routes';

interface NotFoundPageProps {
  lang: Language;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ lang }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-950">
      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-300 text-xs font-bold mb-6">
          404
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
          {lang === 'pl' ? 'Ta strona nie istnieje' : 'This page does not exist'}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {lang === 'pl'
            ? 'Sprawdź adres lub przejdź do strony głównej. Jeśli potrzebujesz pomocy, skontaktuj się z nami.'
            : 'Check the address or go back to the homepage. If you need help, contact us.'}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-slate-900 font-bold hover:bg-blue-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            {lang === 'pl' ? 'Strona główna' : 'Go to homepage'}
          </Link>
          <Link
            to={ROUTES.contact}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
          >
            {lang === 'pl' ? 'Kontakt' : 'Contact'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
