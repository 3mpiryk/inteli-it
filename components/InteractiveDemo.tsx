
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, UploadCloud, CheckCircle, RefreshCw } from 'lucide-react';

type SimulationStep = {
  id: number;
  label: string;
  type: 'OCR' | 'AI' | 'API' | 'MAIL' | 'DONE';
  time: string;
};

const STEPS: SimulationStep[] = [
  { id: 1, label: 'Odczytywanie danych z faktury...', type: 'OCR', time: '0.2s' },
  { id: 2, label: 'Weryfikacja poprawności danych...', type: 'AI', time: '0.5s' },
  { id: 3, label: 'Zapisywanie w systemie księgowym...', type: 'API', time: '0.8s' },
  { id: 4, label: 'Wysłanie potwierdzenia na e-mail...', type: 'MAIL', time: '1.1s' },
  { id: 5, label: 'Proces zakończony!', type: 'DONE', time: '1.3s' },
];

const getTypeClass = (type: SimulationStep['type']) => {
  switch (type) {
    case 'OCR': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'AI': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'API': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    case 'MAIL': return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'DONE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    default: return 'bg-slate-700 text-slate-300';
  }
};

const InteractiveDemo: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<SimulationStep[]>([]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isProcessing) {
      startSimulation();
    }
  };

  const startSimulation = () => {
    setIsProcessing(true);
    setCompletedSteps([]);
    
    let delay = 0;
    STEPS.forEach((step, index) => {
      delay += (Math.random() * 300) + 300; // Staggered appearance
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, step]);
      }, delay);
    });
    
    setTimeout(() => {
      setIsProcessing(false);
    }, delay + 500);
  };

  const resetSimulation = () => {
    setIsProcessing(false);
    setCompletedSteps([]);
  };

  return (
    <motion.div 
      className="glass-card p-6 rounded-2xl w-full max-w-2xl mx-auto mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Draggable File */}
        <div className="w-full md:w-1/3 text-center flex flex-col items-center">
            <p className="font-bold text-white mb-2 text-sm">Złap i upuść plik</p>
            <motion.div
                draggable
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-grab transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, cursor: 'grabbing' }}
            >
                <FileText className="w-12 h-12 text-blue-400" />
                <span className="text-white font-semibold mt-2 text-sm">faktura.pdf</span>
                <span className="text-slate-500 text-xs">213 KB</span>
            </motion.div>
             <button
                onClick={resetSimulation}
                className="mt-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
            >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                Resetuj
            </button>
        </div>

        {/* Drop Zone & Simulation Steps */}
        <div 
          className={`w-full md:w-2/3 h-64 p-4 rounded-lg border-2 border-dashed transition-all duration-300 flex flex-col ${completedSteps.length > 0 ? 'border-slate-800' : 'border-slate-700'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {completedSteps.length === 0 ? (
            <div className="w-full h-full flex flex-col justify-center items-center text-slate-500">
                <UploadCloud className="w-12 h-12 mb-2" />
                <p className="font-semibold text-slate-400">Upuść plik tutaj</p>
                <p className="text-sm">aby rozpocząć symulację</p>
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto h-full">
              <AnimatePresence>
                {completedSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-between p-2 rounded-lg text-sm ${getTypeClass(step.type)}`}
                  >
                    <div className="flex items-center gap-2">
                        {step.type === 'DONE' 
                          ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                          : <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-black/20">{step.type}</span>
                        }
                        <span className="font-medium">{step.label}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">[{step.time}]</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveDemo;
