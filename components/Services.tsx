import React from 'react';
import { Language } from '../types';
import { SERVICES } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  lang: Language;
}

const Services: React.FC<ServicesProps> = ({ lang }) => {
  return (
    <section id="services" className="py-24 relative bg-slate-900/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            {lang === 'pl' ? 'Co automatyzujemy?' : 'What We Automate'}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {lang === 'pl' 
              ? 'Wdrażamy rozwiązania w kluczowych obszarach Twojej firmy, aby uwolnić potencjał zespołu.' 
              : 'We implement solutions in key areas of your business to unlock your team\'s potential.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div key={index} className="glass-card p-8 rounded-2xl hover:bg-slate-800/80 transition-colors group">
              <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5">
                <service.icon className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title[lang]}</h3>
              <p className="text-slate-400 mb-6">{service.description[lang]}</p>
              <ul className="space-y-3">
                {service.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;