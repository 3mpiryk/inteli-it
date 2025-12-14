
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, PlayCircle, Cloud, Laptop, Database, Activity, CheckCircle2, Zap } from 'lucide-react';
import { Language } from '../types';
import { HERO_CONTENT, HERO_STATS } from '../constants';

interface HeroProps {
  lang: Language;
}

const LiveTicker = ({ lang }: { lang: Language }) => {
  const events = [
    { type: 'OCR', msg: lang === 'pl' ? 'Skanowanie faktury FV/2024/05...' : 'Scanning invoice INV/2024/05...', time: '0.2s' },
    { type: 'API', msg: lang === 'pl' ? 'Synchronizacja HubSpot <-> Subiekt...' : 'Syncing HubSpot <-> Subiekt...', time: '0.4s' },
    { type: 'AI', msg: lang === 'pl' ? 'Kwalifikacja leada: Wysoki priorytet' : 'Lead Qualification: High Priority', time: '0.8s' },
    { type: 'MAIL', msg: lang === 'pl' ? 'Generowanie draftu odpowiedzi...' : 'Generating email draft response...', time: '1.1s' },
    { type: 'DB', msg: lang === 'pl' ? 'Backup bazy danych zakończony' : 'Database backup completed', time: '0.1s' },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-t border-white/5 py-3 overflow-hidden flex items-center z-20">
      <div className="container mx-auto px-6 flex items-center gap-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {lang === 'pl' ? 'SYSTEM LIVE:' : 'SYSTEM LIVE:'}
        </div>
        
        <div className="flex-1 overflow-hidden relative h-6 mask-linear-fade">
          <motion.div 
            className="flex gap-12 absolute whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          >
            {[...events, ...events, ...events].map((evt, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  evt.type === 'AI' ? 'bg-purple-500/20 text-purple-400' :
                  evt.type === 'OCR' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {evt.type}
                </span>
                <span>{evt.msg}</span>
                <span className="text-emerald-500/70">[{evt.time}]</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const [dynamicWordIndex, setDynamicWordIndex] = useState(0);
  
  const words = lang === 'pl' 
    ? ['Sprzedaży', 'Finansów', 'Logistyki', 'HR'] 
    : ['Sales', 'Finance', 'Logistics', 'HR'];

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [lang]);

  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-slate-900/50 border border-white/10 text-slate-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{lang === 'pl' ? 'Nowa era biznesu:' : 'New business era:'} AI-First</span>
            </div>

            {/* Optimized LCP: Removed initial opacity animation from H1 */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
              {lang === 'pl' ? 'Automatyzacja ' : 'Automating '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={dynamicWordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block gradient-text"
                >
                  {words[dynamicWordIndex]}
                </motion.span>
              </AnimatePresence>
              <br />
              {lang === 'pl' ? '& Sztuczna Inteligencja' : '& Artificial Intelligence'}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {HERO_CONTENT.subtitle[lang]}
            </p>

            {/* Visual Flow Animation */}
            <div className="relative w-full max-w-lg mx-auto h-24 mb-12 hidden sm:block">
               {/* Connecting Line */}
               <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-800 -translate-y-1/2" />
               <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 -translate-y-1/2" />
               
               <div className="flex justify-between items-center relative h-full px-8">
                  {/* Node 1 */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/30 z-10 relative shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <Laptop className="w-8 h-8 text-blue-400 relative z-10" />
                  </div>

                  {/* Node 2 */}
                  <div className="bg-slate-950 p-4 rounded-full border border-purple-500/30 z-10 relative shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <Cloud className="w-10 h-10 text-purple-400 relative z-10" />
                  </div>

                  {/* Node 3 */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 z-10 relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Database className="w-8 h-8 text-emerald-400 relative z-10" />
                  </div>
               </div>

               {/* Moving Particles */}
               <motion.div
                  className="absolute top-1/2 left-[15%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] z-20"
                  animate={{ left: ["15%", "50%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{ translateY: "-50%" }}
               />
               <motion.div
                  className="absolute top-1/2 left-[50%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] z-20"
                  animate={{ left: ["50%", "85%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.75 }}
                  style={{ translateY: "-50%" }}
               />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a 
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group hover:scale-105"
              >
                {HERO_CONTENT.ctaPrimary[lang]}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 glass-card hover:bg-white/10 text-white rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5 text-emerald-400" />
                {HERO_CONTENT.ctaSecondary[lang]}
              </a>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-10"
          >
            {HERO_STATS.map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <div className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wide">{stat.label[lang]}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <LiveTicker lang={lang} />
    </section>
  );
};

export default Hero;
