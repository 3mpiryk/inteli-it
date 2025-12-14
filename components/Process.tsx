import React from 'react';
import { Language } from '../types';
import { PROCESS_STEPS } from '../constants';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ProcessProps {
  lang: Language;
}

const Process: React.FC<ProcessProps> = ({ lang }) => {
  return (
    <section id="process" className="py-24 bg-slate-950 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-white">
            {lang === 'pl' ? 'Jak pracujemy?' : 'How We Work?'}
          </h2>
          <p className="text-slate-400">
            {lang === 'pl' ? 'Od chaosu do porządku w 5 krokach.' : 'From chaos to order in 5 steps.'}
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2"></div>

          <div className="space-y-12 relative z-10">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Text Side */}
                <div className={`flex-1 text-center ${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <h3 className="text-xl font-bold text-blue-400 mb-2">{step.title[lang]}</h3>
                  <p className="text-slate-400 max-w-sm mx-auto md:mx-0 inline-block mb-3">{step.description[lang]}</p>
                  
                  {/* Deliverable Badge */}
                  <div className={`flex items-center gap-2 justify-center ${index % 2 !== 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                       <CheckCircle2 className="w-3 h-3" />
                       {step.deliverable[lang]}
                    </div>
                  </div>
                </div>

                {/* Center Node */}
                <div className="w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center relative shrink-0 z-10 shadow-xl shadow-black/50">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>

                {/* Empty Side for balance */}
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;