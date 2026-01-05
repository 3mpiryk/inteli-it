import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { ROUTES } from '../routes';

interface DemoSectionProps {
  lang: Language;
}

// Data for the interactive demo
const DEMO_DATA = {
  industries: [
    { id: 'ecommerce', pl: 'E-commerce', en: 'E-commerce' },
    { id: 'services', pl: 'Usługi B2B', en: 'B2B Services' },
    { id: 'realestate', pl: 'Nieruchomości', en: 'Real Estate' },
    { id: 'legal', pl: 'Prawo / Finanse', en: 'Legal / Finance' }
  ],
  problems: [
    { id: 'time', pl: 'Brak czasu / Ręczna praca', en: 'Lack of time / Manual work' },
    { id: 'chaos', pl: 'Chaos w dokumentach', en: 'Document chaos' },
    { id: 'leads', pl: 'Gubienie leadów', en: 'Losing leads' }
  ],
  results: {
    ecommerce: {
      time: { pl: 'Integracja Sklep <-> ERP z automatycznym generowaniem etykiet kurierskich.', en: 'Store <-> ERP integration with auto courier label generation.' },
      chaos: { pl: 'AI automatycznie kategoryzuje zwroty i reklamacje na podstawie treści maili.', en: 'AI auto-categorizes returns and complaints based on email content.' },
      leads: { pl: 'System "Odzyskiwanie koszyków" z personalizowanym wideo dla klienta.', en: '"Cart Recovery" system with personalized video for the client.' }
    },
    services: {
      time: { pl: 'Asystent AI generujący podsumowania spotkań i listę zadań w Asanie/Jira.', en: 'AI Assistant generating meeting summaries and task lists in Asana/Jira.' },
      chaos: { pl: 'Centralny dashboard zbierający dane z CRM, maili i kalendarza.', en: 'Central dashboard gathering data from CRM, emails, and calendar.' },
      leads: { pl: 'Automatyczny scoring leadów i przydzielanie do handlowców w CRM.', en: 'Automated lead scoring and assignment to sales reps in CRM.' }
    },
    realestate: {
      time: { pl: 'Bot umawiający spotkania i wysyłający SMS z przypomnieniem.', en: 'Bot scheduling appointments and sending SMS reminders.' },
      chaos: { pl: 'Automatyczne generowanie umów najmu na podstawie formularza zgłoszeniowego.', en: 'Auto-generation of lease agreements based on application forms.' },
      leads: { pl: 'Natychmiastowy kontakt z klientem z portalu ogłoszeniowego (poniżej 1 min).', en: 'Instant contact with portal leads (under 1 min).' }
    },
    legal: {
      time: { pl: 'Analiza umów przez AI pod kątem ryzykownych zapisów.', en: 'AI contract analysis for risky clauses.' },
      chaos: { pl: 'Automatyczne sortowanie faktur i pism do odpowiednich folderów w chmurze.', en: 'Auto-sorting invoices and letters to correct cloud folders.' },
      leads: { pl: 'Onboarding klienta: automatyczne zbieranie danych i generowanie pełnomocnictw.', en: 'Client onboarding: auto data collection and power of attorney generation.' }
    }
  }
};

const DemoSection: React.FC<DemoSectionProps> = ({ lang }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [industry, setIndustry] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIndustrySelect = (id: string) => {
    setIndustry(id);
    setStep(2);
  };

  const handleProblemSelect = (id: string) => {
    setProblem(id);
    setLoading(true);
    setStep(3);
    setTimeout(() => setLoading(false), 1500); // Simulate AI thinking
  };

  const reset = () => {
    setStep(1);
    setIndustry(null);
    setProblem(null);
  };

  const getResult = () => {
    if (!industry || !problem) return '';
    // @ts-ignore
    return DEMO_DATA.results[industry][problem][lang];
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      {/* Dark gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              {lang === 'pl' ? 'Demo Interaktywne' : 'Interactive Demo'}
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              {lang === 'pl' ? 'Sprawdź, co możemy dla Ciebie zrobić' : 'See What We Can Do For You'}
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              {lang === 'pl' 
                ? 'Wybierz swoją branżę i największy problem. Nasz "AI Finder" zaproponuje konkretne rozwiązanie, które wdrażamy u klientów.'
                : 'Select your industry and biggest pain point. Our "AI Finder" will propose a specific solution we implement for clients.'}
            </p>
            
            <div className="hidden lg:block p-6 bg-slate-800/30 rounded-xl border border-white/5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">AI</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{lang === 'pl' ? 'Dlaczego to działa?' : 'Why it works?'}</h3>
                  <p className="text-slate-400 text-sm">
                    {lang === 'pl' 
                     ? 'Łączymy proste skrypty z zaawansowanymi modelami językowymi. To pozwala na elastyczność, której nie dają gotowe pudełkowe systemy.'
                     : 'We combine simple scripts with advanced language models. This allows for flexibility that off-the-shelf boxed systems cannot provide.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="glass-card rounded-2xl p-1 border border-blue-500/20 shadow-2xl shadow-blue-900/20 min-h-[400px]">
              <div className="bg-slate-950/80 rounded-xl p-8 h-full flex flex-col justify-center items-center text-center relative overflow-hidden">
                
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full"
                    >
                      <h3 className="text-xl font-bold text-white mb-6">
                        {lang === 'pl' ? 'Wybierz branżę' : 'Select Industry'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {DEMO_DATA.industries.map((ind) => (
                          <button 
                            key={ind.id}
                            onClick={() => handleIndustrySelect(ind.id)}
                            className="p-4 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-all text-slate-300 font-medium text-left border border-white/5 hover:border-transparent"
                          >
                            {/* @ts-ignore */}
                            {ind[lang]}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="w-full"
                    >
                      <button onClick={reset} className="absolute top-0 left-0 text-xs text-slate-400 hover:text-white uppercase tracking-wider mb-4 font-bold flex items-center gap-1">
                        &larr; {lang === 'pl' ? 'Wróć' : 'Back'}
                      </button>
                      <h3 className="text-xl font-bold text-white mb-6">
                        {lang === 'pl' ? 'Co Cię najbardziej boli?' : 'What hurts the most?'}
                      </h3>
                      <div className="space-y-3">
                        {DEMO_DATA.problems.map((prob) => (
                          <button 
                            key={prob.id}
                            onClick={() => handleProblemSelect(prob.id)}
                            className="w-full p-4 rounded-lg bg-slate-800 hover:bg-purple-600 hover:text-white transition-all text-slate-300 font-medium text-left border border-white/5 hover:border-transparent"
                          >
                            {/* @ts-ignore */}
                            {prob[lang]}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full flex flex-col items-center"
                    >
                      {loading ? (
                        <div className="py-12">
                          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                          <p className="text-blue-400 font-mono text-sm">
                            {lang === 'pl' ? 'Analizowanie rozwiązania...' : 'Analyzing solution...'}
                          </p>
                        </div>
                      ) : (
                        <div className="text-left w-full">
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 mb-6">
                            <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                              {lang === 'pl' ? 'Rekomendacja Inteli-IT' : 'Inteli-IT Recommendation'}
                            </div>
                            <p className="text-xl text-white font-medium leading-relaxed">
                              {getResult()}
                            </p>
                          </div>
                          
                          <p className="text-slate-400 text-sm mb-6">
                            {lang === 'pl' 
                              ? 'To tylko wierzchołek góry lodowej. Możemy to zbudować w mniej niż 3 tygodnie.'
                              : 'This is just the tip of the iceberg. We can build this in less than 3 weeks.'}
                          </p>

                          <div className="flex gap-4">
                            <button onClick={reset} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                              {lang === 'pl' ? 'Sprawdź inne' : 'Check other'}
                            </button>
                            <Link
                              to={ROUTES.contact}
                              className="px-6 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-blue-50 flex items-center gap-2"
                            >
                              {lang === 'pl' ? 'Wdróż to u mnie' : 'Implement this'}
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DemoSection;
