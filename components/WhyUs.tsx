import React from 'react';
import { Language } from '../types';
import { WHY_US_ITEMS } from '../constants';

interface WhyUsProps {
  lang: Language;
}

const WhyUs: React.FC<WhyUsProps> = ({ lang }) => {
  return (
    <section className="py-20 bg-slate-950 border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
            {lang === 'pl' ? 'Dlaczego Inteli-IT?' : 'Why Inteli-IT?'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {lang === 'pl' 
              ? 'Wdrożenie technologii to łatwa część. Trudniejsza to sprawić, by technologia realnie wspierała Twój biznes.' 
              : 'Implementing technology is the easy part. The hard part is making technology actually support your business.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WHY_US_ITEMS.map((item, index) => (
            <div key={index} className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title[lang]}</h3>
              <p className="text-slate-400 leading-relaxed">
                {item.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;