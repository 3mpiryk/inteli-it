import React, { useState } from 'react';
import { Language } from '../types';
import { EDUCATION_MODULES, GLOSSARY } from '../constants';
import { ArrowRight, Lightbulb, AlertTriangle, BookOpen, Play, Check, Globe, Cpu, Database, MessageSquare, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveDemo from './InteractiveDemo';

interface EducationProps {
  lang: Language;
  onNavigateToContact: () => void;
}

const ThoughtBubble = ({ text, isVisible }: { text: string | null; isVisible: boolean }) => {
  return (
    <AnimatePresence>
      {isVisible && text && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          className="absolute -top-24 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-4 py-2 rounded-xl shadow-xl z-30 min-w-[140px] text-center"
        >
          <div className="text-xs font-bold relative z-10">{text}</div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AutomationSimulator = ({ lang }: { lang: Language }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const runSimulation = () => {
    if (status === 'running') return;
    setStatus('running');
    setStep(1);
    setLogs([]);

    const addLog = (text: string) => setLogs(prev => [...prev, `> ${text}`]);

    addLog(lang === 'pl' ? 'Inicjalizacja Webhooka...' : 'Initializing Webhook...');

    setTimeout(() => {
      setStep(2);
      addLog(lang === 'pl' ? 'Odebrano dane JSON (200 OK)' : 'JSON Data Received (200 OK)');
    }, 2000);

    setTimeout(() => {
      setStep(3);
      addLog(lang === 'pl' ? 'AI analizuje treść wiadomości...' : 'AI analyzing message content...');
    }, 4000);

    setTimeout(() => {
      setStep(4);
      addLog(lang === 'pl' ? 'Wykryto intencję: "Oferta"' : 'Intent detected: "Proposal"');
    }, 6000);

    setTimeout(() => {
      setStep(5);
      addLog(lang === 'pl' ? 'Wysyłanie do CRM i Slack...' : 'Sending to CRM and Slack...');
    }, 8000);

    setTimeout(() => {
      setStep(6);
      addLog(lang === 'pl' ? 'Proces zakończony sukcesem.' : 'Process completed successfully.');
      setStatus('finished');
    }, 9500);
  };

  const getBubbleText = (node: 'source' | 'logic' | 'crm' | 'slack') => {
    if (node === 'source') {
      if (step === 1) return lang === 'pl' ? 'Wpadło zapytanie!' : 'New inquiry received!';
      if (step === 2) return lang === 'pl' ? 'Wysyłam dane...' : 'Sending data...';
    }
    if (node === 'logic') {
      if (step === 2) return lang === 'pl' ? 'Odbieram dane...' : 'Receiving...';
      if (step === 3) return lang === 'pl' ? 'Hmm, co my tu mamy? Analizuję...' : 'Hmm, analyzing content...';
      if (step === 4) return lang === 'pl' ? 'Aha! To prośba o ofertę. Robię draft.' : 'Aha! Quote request. Drafting...';
      if (step === 5) return lang === 'pl' ? 'Rozsyłam do systemów!' : 'Distributing data!';
    }
    if (node === 'crm' && step >= 6) return lang === 'pl' ? 'Mam to! Zapisane.' : 'Got it! Saved.';
    if (node === 'slack' && step >= 6) return lang === 'pl' ? 'Nowy lead dodany!' : 'Boss, new lead!';
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-3xl border border-blue-500/20 overflow-hidden shadow-2xl relative">
      <div className="bg-slate-950 px-6 py-4 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          {lang === 'pl' ? 'Wizualizacja Silnika Automatyzacji' : 'Automation Engine Visualizer'}
        </div>
      </div>

      <div className="p-8 md:p-12 relative min-h-[450px] flex flex-col justify-between">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 mt-12">
          
          <div className="flex flex-col items-center gap-4 relative group">
            <ThoughtBubble text={getBubbleText('source')} isVisible={step === 1 || step === 2} />
            <motion.div 
              animate={step >= 1 ? { scale: 1.1, borderColor: '#3b82f6', boxShadow: '0 0 20px rgba(59,130,246,0.5)' } : {}}
              className="w-20 h-20 bg-slate-800 rounded-2xl border-2 border-slate-700 flex items-center justify-center relative z-20"
            >
              <Globe className={`w-8 h-8 ${step >= 1 ? 'text-blue-400' : 'text-slate-500'}`} />
            </motion.div>
            <span className="text-slate-400 text-sm font-bold">Website / Ads</span>
          </div>

          <div className="flex-1 w-1 md:w-full h-16 md:h-1 bg-slate-800 relative rounded-full overflow-hidden">
             {step >= 2 && (
               <motion.div 
                  layoutId="packet1"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2, ease: "linear", repeat: step === 2 ? Infinity : 0 }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"
               />
             )}
          </div>

          <div className="flex flex-col items-center gap-4 relative">
            <ThoughtBubble text={getBubbleText('logic')} isVisible={step >= 2 && step <= 5} />
            <motion.div 
              animate={step >= 3 && step < 5 ? { scale: [1, 1.1, 1], borderColor: '#8b5cf6', boxShadow: '0 0 30px rgba(139,92,246,0.6)' } : step >= 5 ? { borderColor: '#8b5cf6' } : {}}
              transition={{ repeat: step >= 3 && step < 5 ? Infinity : 0, duration: 1 }}
              className="w-24 h-24 bg-slate-900 rounded-full border-2 border-slate-700 flex items-center justify-center relative z-20"
            >
              <Cpu className={`w-10 h-10 ${step >= 3 ? 'text-purple-400' : 'text-slate-500'}`} />
              {step >= 3 && step < 5 && (
                <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-ping opacity-20" />
              )}
            </motion.div>
            <span className="text-slate-400 text-sm font-bold">API & AI Logic</span>
          </div>

          <div className="flex-1 w-1 md:w-full h-16 md:h-1 bg-slate-800 relative rounded-full overflow-hidden">
            {step >= 5 && (
               <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
               />
             )}
          </div>

          <div className="flex flex-col gap-8">
            <div className="relative">
              <ThoughtBubble text={getBubbleText('crm')} isVisible={step >= 6} />
              <motion.div 
                animate={step >= 6 ? { x: 0, opacity: 1, borderColor: '#10b981' } : { x: 10, opacity: 0.5 }}
                className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 w-48 relative z-20"
              >
                <Database className={`w-5 h-5 ${step >= 6 ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold">CRM</span>
                  <span className="text-[10px] text-slate-500">{step >= 6 ? 'Updated' : 'Waiting'}</span>
                </div>
                {step >= 6 && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
              </motion.div>
            </div>

            <div className="relative">
              <ThoughtBubble text={getBubbleText('slack')} isVisible={step >= 6} />
              <motion.div 
                animate={step >= 6 ? { x: 0, opacity: 1, borderColor: '#ec4899' } : { x: 10, opacity: 0.5 }}
                className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-xl border border-slate-700 w-48 relative z-20"
              >
                <MessageSquare className={`w-5 h-5 ${step >= 6 ? 'text-pink-400' : 'text-slate-500'}`} />
                <div className="flex flex-col">
                  <span className="text-white text-xs font-bold">Slack</span>
                  <span className="text-[10px] text-slate-500">{step >= 6 ? 'Sent' : 'Waiting'}</span>
                </div>
                {step >= 6 && <Check className="w-4 h-4 text-pink-500 ml-auto" />}
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full bg-slate-950 rounded-lg p-4 font-mono text-xs h-32 overflow-y-auto border border-white/5 scrollbar-thin scrollbar-thumb-slate-700 shadow-inner">
            <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1 flex justify-between">
              <span>System Logs</span>
              <span className="text-[10px] opacity-50">Live Stream</span>
            </div>
            {logs.length === 0 && <span className="text-slate-700">Ready to start...</span>}
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400 mb-1 font-mono">
                {log}
              </motion.div>
            ))}
          </div>

          <button
            onClick={runSimulation}
            disabled={status === 'running'}
            className={`
              relative overflow-hidden group px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all min-w-[200px]
              ${status === 'running' ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-blue-500/25'}
            `}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {status === 'running' ? (
                <>
                  <Server className="w-5 h-5 animate-pulse" />
                  {lang === 'pl' ? 'Przetwarzanie...' : 'Processing...'}
                </>
              ) : status === 'finished' ? (
                <>
                  <Play className="w-5 h-5" />
                  {lang === 'pl' ? 'Uruchom ponownie' : 'Re-run Simulation'}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {lang === 'pl' ? 'Symuluj Proces' : 'Simulate Process'}
                </>
              )}
            </div>
            {status !== 'running' && (
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

const Education: React.FC<EducationProps> = ({ lang, onNavigateToContact }) => {
  return (
    <div className="bg-slate-950 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm mb-6"
          >
            <Lightbulb className="w-4 h-4" />
            {lang === 'pl' ? 'Akademia Automatyzacji' : 'Automation Academy'}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
            {lang === 'pl' ? 'Zrozumieć Problemy i ' : 'Understand Problems & '}
            <span className="gradient-text">{lang === 'pl' ? 'Rozwiązania' : 'Solutions'}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            {lang === 'pl' 
              ? 'Większość firm traci pieniądze nie dlatego, że nie chce pracować, ale dlatego, że tonie w "niewidzialnej pracy". Tutaj dowiesz się, jak to zmienić.'
              : 'Most companies lose money not because they don\'t want to work, but because they are drowning in "invisible work". Here you will learn how to change that.'}
          </p>
        </div>

        <div className="mb-24">
            <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                {lang === 'pl' ? 'Przykład 1: Automatyczne Przetwarzanie Faktury' : 'Example 1: Automated Invoice Processing'}
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                {lang === 'pl' ? 'Zamiast ręcznie przepisywać dane, upuść plik i zobacz, jak system robi to za Ciebie w kilka sekund.' : 'Instead of manual data entry, drop a file and watch the system do it for you in seconds.'}
                </p>
            </div>
            <InteractiveDemo />
        </div>

        <div className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
              {lang === 'pl' ? 'Przykład 2: Jak działa automatyzacja "pod maską"?' : 'Example 2: How automation works "under the hood"?'}
            </h2>
            <p className="text-slate-400">
              {lang === 'pl' ? 'Zobacz, jak dane przepływają między systemami bez udziału człowieka po otrzymaniu zapytania z formularza.' : 'See how data flows between systems without human intervention after a form submission.'}
            </p>
          </div>
          <AutomationSimulator lang={lang} />
        </div>

        <div className="mb-24 space-y-16">
          {EDUCATION_MODULES.map((module, idx) => (
            <div key={module.id} className="bg-slate-900 rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-8 md:p-10 border-b border-white/10 bg-gradient-to-r from-slate-900 to-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <module.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{module.title[lang]}</h3>
                    <p className="text-slate-400">{module.description[lang]}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-slate-800">
                {module.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-slate-900 p-8 hover:bg-slate-800/30 transition-colors">
                    <div className="mb-6">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 block">
                        {lang === 'pl' ? 'Problem (Stara Szkoła)' : 'Problem (Old School)'}
                      </span>
                      <p className="text-slate-300 font-medium border-l-2 border-red-500/30 pl-4 py-1">
                        "{item.problem[lang]}"
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 block">
                        {lang === 'pl' ? 'Rozwiązanie (Nowa Szkoła)' : 'Solution (New School)'}
                      </span>
                      <p className="text-white font-medium border-l-2 border-emerald-500/30 pl-4 py-1">
                        {item.solution[lang]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-900/10 p-3 rounded-lg border border-blue-500/10">
                      <ArrowRight className="w-4 h-4 shrink-0" />
                      <span className="font-semibold">{lang === 'pl' ? 'Efekt:' : 'Impact:'}</span>
                      <span>{item.benefit[lang]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <BookOpen className="text-blue-500 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">
              {lang === 'pl' ? 'Słownik Pojęć (Prosty Język)' : 'Dictionary (Simple Language)'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {GLOSSARY.map((term, idx) => (
              <div key={idx} className="bg-slate-900 p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-bold text-blue-400 mb-2">{term.term}</h3>
                <p className="text-white mb-4 text-lg">{term.definition[lang]}</p>
                <div className="bg-slate-800/50 p-4 rounded-lg text-slate-400 text-sm italic border-l-4 border-purple-500/50">
                  <span className="font-bold text-purple-400 not-italic mr-2">
                    {lang === 'pl' ? 'Analogia:' : 'Analogy:'}
                  </span>
                  {term.analogy[lang]}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-10 rounded-3xl border border-white/10 relative">
            <h3 className="text-2xl font-bold text-white mb-4">
              {lang === 'pl' ? 'Czujesz, że to o Twojej firmie?' : 'Feel like this is about your company?'}
            </h3>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              {lang === 'pl' 
                ? 'Wiedza to pierwszy krok. Drugim jest działanie. Nie musisz robić tego sam.'
                : 'Knowledge is the first step. Action is the second. You don\'t have to do it alone.'}
            </p>
            
            <button
              onClick={onNavigateToContact}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-colors cursor-pointer relative z-50"
            >
              {lang === 'pl' ? 'Umów darmową analizę' : 'Book Free Analysis'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Education;
