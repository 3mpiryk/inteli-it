import React from 'react';
import { Language } from '../types';
import { CASE_STUDIES } from '../constants';
import { ArrowUpRight } from 'lucide-react';

interface CaseStudiesProps {
  lang: Language;
}

const CaseStudies: React.FC<CaseStudiesProps> = ({ lang }) => {
  return (
    <section id="cases" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-12 text-center">
          {lang === 'pl'
            ? 'Przykładowe automatyzacje (case studies)'
            : 'Case Studies'}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CASE_STUDIES.map((study, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-white/5 rounded-2xl p-8 hover:border-blue-500/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-slate-700 rounded text-xs font-bold text-slate-300 uppercase tracking-wide">
                  {study.industry[lang]}
                </span>
                <ArrowUpRight className="text-slate-500" />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-red-400 text-sm font-bold uppercase mb-1">
                    {lang === 'pl' ? 'Problem' : 'The Problem'}
                  </h3>
                  <p className="text-slate-300">{study.problem[lang]}</p>
                </div>

                <div>
                  <h3 className="text-blue-400 text-sm font-bold uppercase mb-1">
                    {lang === 'pl' ? 'Rozwiązanie' : 'The Solution'}
                  </h3>
                  <p className="text-slate-300">{study.solution[lang]}</p>
                </div>

                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                  {study.results.map((result, i) => (
                    <div key={i}>
                      <p className="text-emerald-400 font-bold text-lg">
                        {result[lang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;