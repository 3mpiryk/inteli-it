import React from 'react';
import { Language } from '../types';
import { FAQ_ITEMS } from '../constants';

interface FAQProps {
  lang: Language;
}

const FAQ: React.FC<FAQProps> = ({ lang }) => {
  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">FAQ</h2>
        
        <div className="space-y-6">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className="border-b border-slate-800 pb-6">
              <h3 className="text-lg font-bold text-white mb-2">{item.question[lang]}</h3>
              <p className="text-slate-400">{item.answer[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;