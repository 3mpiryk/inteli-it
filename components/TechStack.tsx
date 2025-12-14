import React from 'react';
import { Language } from '../types';
import { TECH_STACK_LABELS } from '../constants';
import { Database, Globe, Cpu, Workflow, MessageSquare } from 'lucide-react';

interface TechStackProps {
  lang: Language;
}

const TechStack: React.FC<TechStackProps> = ({ lang }) => {
  const categories = [
    { name: 'CRM & ERP', icon: Database, tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Subiekt GT', 'Comarch'] },
    { name: 'E-commerce', icon: Globe, tools: ['WooCommerce', 'Shopify', 'Baselinker', 'PrestaShop'] },
    { name: 'Automation', icon: Workflow, tools: ['Make (Integromat)', 'Zapier', 'n8n', 'Power Automate'] },
    { name: 'AI & LLM', icon: Cpu, tools: ['OpenAI API', 'Claude', 'LangChain', 'Pinecone'] },
  ];

  return (
    <section className="py-20 bg-slate-950 border-b border-white/5">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">{TECH_STACK_LABELS.title[lang]}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12">
          {TECH_STACK_LABELS.subtitle[lang]}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-3">{cat.name}</h3>
              <ul className="space-y-1">
                {cat.tools.map((t, i) => (
                  <li key={i} className="text-sm text-slate-400">{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;