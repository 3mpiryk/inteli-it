
import React from 'react';

export type Language = 'pl' | 'en';

export interface BilingualText {
  pl: string;
  en: string;
}

export interface NavItem {
  label: BilingualText;
  href: string;
  isPage?: boolean;
}

export interface Feature {
  title: BilingualText;
  description: BilingualText;
  items: BilingualText[];
  icon: React.ElementType;
}

export interface Stat {
  value: string;
  label: BilingualText;
}

export interface ProcessStep {
  title: BilingualText;
  description: BilingualText;
  deliverable: BilingualText;
}

export interface CaseStudy {
  industry: BilingualText;
  problem: BilingualText;
  solution: BilingualText;
  results: BilingualText[];
}

export interface Testimonial {
  text: BilingualText;
  author: string;
  role: string;
  company: string;
}

export interface FAQItem {
  question: BilingualText;
  answer: BilingualText;
}

export interface WhyUsItem {
  title: BilingualText;
  description: BilingualText;
  icon: React.ElementType;
}

export interface EducationModule {
  id: string;
  title: BilingualText;
  description: BilingualText;
  icon: React.ElementType;
  items: {
    problem: BilingualText;
    solution: BilingualText;
    benefit: BilingualText;
  }[];
}

export interface GlossaryTerm {
  term: string;
  definition: BilingualText;
  analogy: BilingualText;
}

export interface CartItem {
  name: string;
  price: number;
  type: 'domain' | 'hosting';
  details?: string;
}

export interface HostingPlan {
  id: string;
  name: string;
  price: number;
  cpu: string;
  ram: string;
  ssd: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface ClientService {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'stopped';
  nextBilling: string;
  uptime: string;
  type: 'automation' | 'ai-agent' | 'hosting';
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'overdue';
  downloadUrl: string;
}

export interface Contract {
  id: string;
  title: string;
  dateSigned: string;
  validUntil: string;
  status: 'active' | 'expired';
  type: 'sla' | 'nda' | 'service';
}
