import { Language } from './types';
import { ROUTES } from './routes';

const BASE_URL = 'https://inteli-it.com';

type SeoEntry = {
  title: { pl: string; en: string };
  description: { pl: string; en: string };
  canonicalPath?: string;
  noindex?: boolean;
};

const SEO_ENTRIES: Record<string, SeoEntry> = {
  [ROUTES.home]: {
    title: {
      pl: 'Automatyzacja procesów i AI dla firm | Inteli-IT',
      en: 'Process Automation & AI for Businesses | Inteli-IT',
    },
    description: {
      pl: 'Inteli-IT automatyzuje procesy w firmach – faktury, maile, zamówienia, raporty. Mniej klikania, więcej biznesu.',
      en: 'Inteli-IT automates business processes: invoices, email, orders, and reporting. Less manual work, more growth.',
    },
    canonicalPath: ROUTES.home,
  },
  [ROUTES.services]: {
    title: {
      pl: 'Oferta automatyzacji i AI | Inteli-IT',
      en: 'Automation & AI Services | Inteli-IT',
    },
    description: {
      pl: 'Poznaj usługi automatyzacji procesów, integracji systemów oraz AI dla firm.',
      en: 'Explore automation, systems integration, and AI services tailored for business teams.',
    },
    canonicalPath: ROUTES.services,
  },
  [ROUTES.process]: {
    title: {
      pl: 'Proces wdrożenia automatyzacji | Inteli-IT',
      en: 'Automation Delivery Process | Inteli-IT',
    },
    description: {
      pl: 'Sprawdź etapy współpracy: analiza, architektura, wdrożenie, testy i wsparcie.',
      en: 'See the delivery stages: analysis, architecture, implementation, testing, and support.',
    },
    canonicalPath: ROUTES.process,
  },
  [ROUTES.demo]: {
    title: {
      pl: 'Demo automatyzacji | Inteli-IT',
      en: 'Automation Demo | Inteli-IT',
    },
    description: {
      pl: 'Interaktywne demo przykładowych automatyzacji w różnych branżach.',
      en: 'Interactive demo of automation solutions across key industries.',
    },
    canonicalPath: ROUTES.demo,
  },
  [ROUTES.caseStudies]: {
    title: {
      pl: 'Case studies automatyzacji | Inteli-IT',
      en: 'Automation Case Studies | Inteli-IT',
    },
    description: {
      pl: 'Zobacz efekty wdrożeń automatyzacji i AI u klientów.',
      en: 'See outcomes of automation and AI implementations for clients.',
    },
    canonicalPath: ROUTES.caseStudies,
  },
  [ROUTES.contact]: {
    title: {
      pl: 'Kontakt | Inteli-IT',
      en: 'Contact | Inteli-IT',
    },
    description: {
      pl: 'Umów bezpłatną konsultację i opisz potrzeby automatyzacji w Twojej firmie.',
      en: 'Book a free consultation and share your automation needs.',
    },
    canonicalPath: ROUTES.contact,
  },
  [ROUTES.education]: {
    title: {
      pl: 'Edukacja: Automatyzacja i AI | Inteli-IT',
      en: 'Education: Automation & AI | Inteli-IT',
    },
    description: {
      pl: 'Proste wyjaśnienia problemów i rozwiązań automatyzacji w firmach.',
      en: 'Clear explanations of automation problems and solutions for businesses.',
    },
    canonicalPath: ROUTES.education,
  },
  [ROUTES.login]: {
    title: {
      pl: 'Logowanie | Inteli-IT',
      en: 'Login | Inteli-IT',
    },
    description: {
      pl: 'Panel klienta Inteli-IT.',
      en: 'Inteli-IT client panel login.',
    },
    canonicalPath: ROUTES.login,
    noindex: true,
  },
  [ROUTES.reset]: {
    title: {
      pl: 'Reset hasła | Inteli-IT',
      en: 'Password Reset | Inteli-IT',
    },
    description: {
      pl: 'Ustaw nowe hasło do panelu klienta.',
      en: 'Set a new password for your client panel.',
    },
    canonicalPath: ROUTES.reset,
    noindex: true,
  },
  [ROUTES.dashboard]: {
    title: {
      pl: 'Panel klienta | Inteli-IT',
      en: 'Client Dashboard | Inteli-IT',
    },
    description: {
      pl: 'Zarządzaj usługami Inteli-IT.',
      en: 'Manage your Inteli-IT services.',
    },
    canonicalPath: ROUTES.dashboard,
    noindex: true,
  },
};

const resolveSeoKey = (pathname: string) => {
  if (pathname === ROUTES.home) return ROUTES.home;
  if (pathname === ROUTES.services) return ROUTES.services;
  if (pathname === ROUTES.process) return ROUTES.process;
  if (pathname === ROUTES.demo) return ROUTES.demo;
  if (pathname === ROUTES.caseStudies) return ROUTES.caseStudies;
  if (pathname === ROUTES.contact) return ROUTES.contact;
  if (pathname === ROUTES.education) return ROUTES.education;
  if (pathname.startsWith(ROUTES.login)) return ROUTES.login;
  if (pathname.startsWith(ROUTES.reset)) return ROUTES.reset;
  if (pathname.startsWith(ROUTES.dashboard)) return ROUTES.dashboard;
  return ROUTES.home;
};

const setMetaTag = (attribute: 'name' | 'property', value: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const setLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

export const applySeo = (pathname: string, lang: Language) => {
  const key = resolveSeoKey(pathname);
  const entry = SEO_ENTRIES[key] ?? SEO_ENTRIES[ROUTES.home];
  const title = entry.title[lang];
  const description = entry.description[lang];
  const canonicalPath = entry.canonicalPath ?? ROUTES.home;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  document.title = title;
  document.documentElement.lang = lang;

  setMetaTag('name', 'description', description);
  setMetaTag('name', 'robots', entry.noindex ? 'noindex, nofollow' : 'index, follow');
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:url', canonicalUrl);
  setLinkTag('canonical', canonicalUrl);
};
