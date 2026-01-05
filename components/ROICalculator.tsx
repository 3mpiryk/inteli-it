import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { Calculator, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '../routes';

interface ROICalculatorProps {
  lang: Language;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ lang }) => {
  const [employees, setEmployees] = useState(5);
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(lang === 'pl' ? 50 : 30); // 50 PLN or 30 EUR/USD equivalent

  // Calculation Logic
  // Weekly Cost = employees * hours * rate
  // Yearly Cost = Weekly * 52
  // We assume automation saves ~80% of this time
  const weeklyCost = employees * hoursPerWeek * hourlyRate;
  const yearlyCost = weeklyCost * 52;
  const potentialSavings = yearlyCost * 0.8;

  const currency = lang === 'pl' ? 'PLN' : 'EUR';

  return (
    <section className="py-24 bg-slate-950 border-b border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Side */}
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6">
              <Calculator className="w-4 h-4" />
              {lang === 'pl' ? 'Kalkulator Oszczędności' : 'ROI Calculator'}
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
              {lang === 'pl' ? 'Ile tracisz na ręcznej pracy?' : 'How much is manual work costing you?'}
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              {lang === 'pl' 
                ? 'Niewidzialne koszty to najwięksi zabójcy marży. Przesuń suwaki i zobacz, ile kapitału możesz odzyskać, wdrażając automatyzację.' 
                : 'Invisible costs are margin killers. Move the sliders to see how much capital you can recover by implementing automation.'}
            </p>
            <div className="flex items-start gap-4">
              <div className="bg-slate-900 p-3 rounded-lg border border-white/10">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{lang === 'pl' ? 'ROI w 3 miesiące' : 'ROI in 3 months'}</h3>
                <p className="text-sm text-slate-400">
                  {lang === 'pl' ? 'Większość naszych wdrożeń zwraca się w pierwszym kwartale.' : 'Most of our implementations pay for themselves in the first quarter.'}
                </p>
              </div>
            </div>
          </div>

          {/* Calculator Card */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative">
              {/* Glow border effect */}
              <div className="absolute inset-0 border border-blue-500/20 rounded-2xl pointer-events-none" />

              <div className="space-y-8">
                {/* Input 1: Employees */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-slate-300 font-medium">
                      {lang === 'pl' ? 'Liczba pracowników biurowych' : 'Office Employees'}
                    </label>
                    <span className="text-blue-400 font-bold">{employees}</span>
                  </div>
                  <input 
                    type="range" min="1" max="100" value={employees} 
                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Input 2: Hours */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-slate-300 font-medium">
                      {lang === 'pl' ? 'Godzin "klikogodzin" tygodniowo (na osobę)' : 'Manual hours per week (per person)'}
                    </label>
                    <span className="text-blue-400 font-bold">{hoursPerWeek} h</span>
                  </div>
                  <input 
                    type="range" min="1" max="40" value={hoursPerWeek} 
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'pl' ? 'Czas spędzony na: maile, Excel, wprowadzanie danych.' : 'Time spent on: emails, Excel, data entry.'}
                  </p>
                </div>

                {/* Input 3: Rate */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-slate-300 font-medium">
                      {lang === 'pl' ? 'Średni koszt godziny pracy (brutto)' : 'Avg Hourly Cost (Gross)'}
                    </label>
                    <span className="text-blue-400 font-bold">{hourlyRate} {currency}</span>
                  </div>
                  <input 
                    type="range" min="20" max="200" step="5" value={hourlyRate} 
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Result Box */}
                <div className="bg-gradient-to-br from-blue-900/50 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                  <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-bold">
                    {lang === 'pl' ? 'Roczny potencjał oszczędności' : 'Yearly Savings Potential'}
                  </p>
                  <motion.div 
                    key={potentialSavings}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl md:text-5xl font-heading font-bold text-white flex items-center gap-2"
                  >
                    <DollarSign className="w-8 h-8 text-emerald-400" />
                    {potentialSavings.toLocaleString()} <span className="text-xl text-slate-500">{currency}</span>
                  </motion.div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-emerald-400 text-sm font-bold">
                    <Clock className="w-4 h-4" />
                    {lang === 'pl' ? 'To około ' : 'That is approx '} 
                    {((employees * hoursPerWeek * 52 * 0.8)).toLocaleString()} 
                    {lang === 'pl' ? ' godzin odzyskanych rocznie' : ' hours reclaimed yearly'}
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    to={ROUTES.contact}
                    className="text-sm text-slate-400 hover:text-white underline decoration-blue-500 decoration-2 underline-offset-4"
                  >
                    {lang === 'pl' ? 'Zróbmy audyt i potwierdźmy te liczby' : 'Let\'s audit and confirm these numbers'}
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
