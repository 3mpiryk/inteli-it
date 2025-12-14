import React from 'react';
import { Language } from '../types';
import { TESTIMONIALS } from '../constants';
import { Quote } from 'lucide-react';

interface TestimonialsProps {
  lang: Language;
}

const Testimonials: React.FC<TestimonialsProps> = ({ lang }) => {
  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-heading font-bold text-center mb-12">
          {lang === 'pl' ? 'Zaufali nam' : 'Trusted by'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {TESTIMONIALS.map((test, index) => (
            <div key={index} className="bg-slate-800 p-8 rounded-xl relative">
              <Quote className="absolute top-6 left-6 w-8 h-8 text-slate-700/50" />
              <p className="text-slate-300 italic mb-6 relative z-10 pl-4">"{test.text[lang]}"</p>
              <div className="flex items-center gap-4 pl-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center font-bold text-white">
                  {test.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{test.author}</div>
                  <div className="text-xs text-slate-400">{test.role}, {test.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;