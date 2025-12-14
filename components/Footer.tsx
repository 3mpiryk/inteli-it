import React from 'react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="py-12 bg-slate-950 border-t border-slate-800 text-center">
      <div className="container mx-auto px-6">
        <div className="mb-8">
           <span className="text-2xl font-heading font-bold text-white tracking-tight">
            Inteli<span className="text-blue-500">-IT</span>
          </span>
          <p className="text-slate-400 mt-2">
            {lang === 'pl' ? 'Automatyzacja, która zarabia.' : 'Automation that pays off.'}
          </p>
        </div>
        
        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Inteli-IT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;