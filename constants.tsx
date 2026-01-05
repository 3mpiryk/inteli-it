
import { BilingualText, NavItem, Feature, Stat, ProcessStep, CaseStudy, Testimonial, FAQItem, WhyUsItem, EducationModule, GlossaryTerm, ClientService, Invoice, Contract, User } from './types';
import { ROUTES } from './routes';
import { 
  BarChart3, 
  Receipt, 
  Truck, 
  Users, 
  LayoutDashboard, 
  Bot, 
  Briefcase,
  Code2,
  HeartHandshake,
  Network,
  Workflow,
  Cpu
} from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
  { label: { pl: 'Oferta', en: 'Services' }, href: ROUTES.services },
  { label: { pl: 'Proces', en: 'Process' }, href: ROUTES.process },
  { label: { pl: 'Edukacja', en: 'Education' }, href: ROUTES.education },
  { label: { pl: 'Case Studies', en: 'Case Studies' }, href: ROUTES.caseStudies },
  { label: { pl: 'Kontakt', en: 'Contact' }, href: ROUTES.contact },
];

export const HERO_STATS: Stat[] = [
  { value: "-40%", label: { pl: "czasu na obsługę maili", en: "time spent on email handling" } },
  { value: "+25%", label: { pl: "leadów obsłużonych w 1 dzień", en: "leads handled same-day" } },
  { value: "3 tyg.", label: { pl: "do pierwszych wdrożeń", en: "to first working automations" } }
];

export const HERO_CONTENT = {
  title: {
    pl: "Automatyzacja procesów & AI dla firm, które chcą rosnąć",
    en: "Process Automation & AI for Companies Ready to Scale"
  },
  subtitle: {
    pl: "Pomagamy firmom wyjść z chaosu operacyjnego. Zamieniamy ręczną pracę w zyskowne, automatyczne procesy.",
    en: "We help B2B & E-commerce companies (10-200 employees) escape operational chaos. We turn manual work into profitable, automated processes."
  },
  ctaPrimary: { pl: "Umów 30-minutową konsultację", en: "Book a 30-min Consultation" },
  ctaSecondary: { pl: "Zobacz przykładowe automatyzacje", en: "See Example Automations" }
};

export const SERVICES: Feature[] = [
  {
    title: { pl: "Sprzedaż i CRM – zero utraconych leadów", en: "Sales & CRM – Zero Lost Leads" },
    description: { pl: "Twój handlowiec nie musi być sekretarką. Niech skupi się na zamykaniu sprzedaży.", en: "Your sales rep shouldn't be a secretary. Let them focus on closing deals." },
    items: [
      { pl: "Lead z Facebook Ads w 3 sekundy trafia do CRM", en: "Lead from FB Ads hits CRM in 3 seconds" },
      { pl: "System sam wysyła follow-up, jeśli klient milczy 2 dni", en: "System auto-sends follow-up if client is silent for 2 days" },
      { pl: "AI generuje draft oferty na podstawie notatki ze spotkania", en: "AI drafts proposal based on meeting notes" },
      { pl: "Synchronizacja kalendarzy handlowców", en: "Sales team calendar sync" }
    ],
    icon: BarChart3
  },
  {
    title: { pl: "Finanse – koniec z wklepywaniem faktur", en: "Finance – No More Manual Entry" },
    description: { pl: "Faktury, windykacja i kategoryzacja kosztów dzieją się same w tle.", en: "Invoicing, collection, and cost categorization happen in the background." },
    items: [
      { pl: "Faktury z maila są odczytywane (OCR) i księgowane", en: "Email invoices are read (OCR) and booked" },
      { pl: "Automatyczne przypisywanie kosztów do projektów", en: "Auto-allocation of costs to projects" },
      { pl: "Miękka windykacja: system sam pilnuje terminów płatności", en: "Soft collection: system watches payment deadlines" },
      { pl: "Raporty Cashflow na maila w każdy poniedziałek", en: "Cashflow reports emailed every Monday" }
    ],
    icon: Receipt
  },
  {
    title: { pl: "Operacje – sklep rozmawia z magazynem", en: "Operations – Store Talks to Warehouse" },
    description: { pl: "Eliminujemy błędy 'czynnika ludzkiego' przy przepisywaniu zamówień.", en: "We eliminate 'human error' in order transcription." },
    items: [
      { pl: "Integracja WooCommerce/Shopify z ERP i kurierem", en: "WooCommerce/Shopify integration with ERP & courier" },
      { pl: "Automatyczne generowanie etykiet przewozowych", en: "Auto-generation of shipping labels" },
      { pl: "Alerty o niskich stanach magazynowych na Slack/Teams", en: "Low stock alerts on Slack/Teams" },
      { pl: "Powiadomienia SMS dla klienta o statusie zamówienia", en: "SMS status updates for customers" }
    ],
    icon: Truck
  },
  {
    title: { pl: "HR – onboarding w 15 minut", en: "HR – Onboarding in 15 Minutes" },
    description: { pl: "Lepsze doświadczenia pracowników i mniej papierologii dla kadr.", en: "Better employee experience and less paperwork for HR." },
    items: [
      { pl: "Jeden formularz generuje umowę, zakłada maila i konta", en: "One form generates contract, email, and accounts" },
      { pl: "Automatyczny obieg wniosków urlopowych", en: "Automated leave request workflow" },
      { pl: "Przypomnienia o badaniach lekarskich i BHP", en: "Medical check-up & safety training reminders" },
      { pl: "Ankiety satysfakcji pracowników", en: "Employee satisfaction surveys" }
    ],
    icon: Users
  },
  {
    title: { pl: "Zarząd – pełna kontrola", en: "Management – Full Control" },
    description: { pl: "Dane w czasie rzeczywistym, zamiast raportów z zeszłego miesiąca.", en: "Real-time data instead of last month's reports." },
    items: [
      { pl: "Dashboard managerski aktualizowany na żywo", en: "Live-updated management dashboard" },
      { pl: "Poranny raport mailowy z najważniejszymi KPI", en: "Morning email report with key KPIs" },
      { pl: "Alerty o anomaliach (np. spadek sprzedaży)", en: "Anomaly alerts (e.g., sales drop)" },
      { pl: "Podsumowania tygodnia generowane przez AI", en: "AI-generated weekly summaries" }
    ],
    icon: LayoutDashboard
  },
  {
    title: { pl: "Bezpieczni Asystenci AI", en: "Secure AI Assistants" },
    description: { pl: "Wewnętrzne narzędzia AI, które znają Twoją firmę, ale nie wynoszą danych.", en: "Internal AI tools that know your company but keep data safe." },
    items: [
      { pl: "Chatbot HR/Ops: 'Gdzie jest wzór umowy?'", en: "HR/Ops Chatbot: 'Where is the contract template?'" },
      { pl: "Asystent mailowy: pisanie odpowiedzi z bazy wiedzy", en: "Email Assistant: drafting replies from knowledge base" },
      { pl: "Analiza długich wątków mailowych w sekundę", en: "Analyzing long email threads in a second" },
      { pl: "Wsparcie techniczne 1. linii (ticket automation)", en: "Level 1 tech support (ticket automation)" }
    ],
    icon: Bot
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    title: { pl: "1. Analiza i Quick Wins", en: "1. Analysis & Quick Wins" },
    description: { 
      pl: "Nie zaczynamy od rewolucji. Szukamy 'nisko wiszących owoców' – procesów, których automatyzacja da szybki zwrot.", 
      en: "We don't start with a revolution. We look for 'low-hanging fruits' – processes that yield quick ROI." 
    },
    deliverable: {
      pl: "Mapa Procesów",
      en: "Process Map"
    }
  },
  {
    title: { pl: "2. Architektura Rozwiązania", en: "2. Solution Architecture" },
    description: { 
      pl: "Projektujemy, jak Twoje obecne systemy (ERP, CRM) bezpiecznie połączą się z nowymi automatyzacjami.", 
      en: "We design how your current systems (ERP, CRM) will securely connect with new automations." 
    },
    deliverable: {
      pl: "Schemat Techniczny",
      en: "Tech Schema"
    }
  },
  {
    title: { pl: "3. Budowa i Integracja", en: "3. Build & Integration" },
    description: { 
      pl: "Programujemy, łączymy API, konfigurujemy scenariusze Make/n8n i modele AI. Działamy na środowisku testowym.", 
      en: "We code, connect APIs, configure Make/n8n scenarios and AI models. We work in a test environment." 
    },
    deliverable: {
      pl: "Działający System (Test)",
      en: "Working System (Test)"
    }
  },
  {
    title: { pl: "4. Testy i Szkolenie Zespołu", en: "4. Testing & Team Training" },
    description: { 
      pl: "Sprawdzamy działanie w boju. Uczymy Twój zespół, jak korzystać z nowych narzędzi, by nie bali się zmian.", 
      en: "We battle-test it. We train your team on how to use new tools so they don't fear change." 
    },
    deliverable: {
      pl: "Instrukcje i Wideo",
      en: "Manuals & Video"
    }
  },
  {
    title: { pl: "5. Wsparcie (SLA)", en: "5. Support (SLA)" },
    description: { 
      pl: "Biznes się zmienia, API się zmieniają. Monitorujemy działanie systemów i reagujemy na błędy.", 
      en: "Business changes, APIs change. We monitor system performance and react to errors." 
    },
    deliverable: {
      pl: "Monitoring 24/7",
      en: "24/7 Monitoring"
    }
  }
];

export const WHY_US_ITEMS: WhyUsItem[] = [
  {
    title: { pl: "Najpierw biznes, potem kod", en: "Business First, Code Second" },
    description: { 
      pl: "Nie jesteśmy tylko programistami. Rozumiemy, czym jest marża, cashflow i lejek sprzedaży. Automatyzacja ma zarabiać.", 
      en: "We aren't just coders. We understand margins, cashflow, and sales funnels. Automation must generate profit." 
    },
    icon: Briefcase
  },
  {
    title: { pl: "Rozliczenie za efekt", en: "Result-Oriented Pricing" },
    description: { 
      pl: "Oferujemy jasne modele współpracy: Fixed Price za wdrożenie konkretnego systemu. Wiesz, za co płacisz.", 
      en: "We offer clear cooperation models: Fixed Price for specific system implementation. You know what you pay for." 
    },
    icon: HeartHandshake
  },
  {
    title: { pl: "Technologie No-Code + AI", en: "No-Code + AI Tech" },
    description: { 
      pl: "Dzięki Make i n8n wdrażamy rozwiązania 5x szybciej niż klasyczne software house'y piszące kod od zera.", 
      en: "Thanks to Make and n8n, we implement solutions 5x faster than classic software houses writing code from scratch." 
    },
    icon: Code2
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    industry: { pl: "E-commerce (sklep online)", en: "E-commerce (online store)" },
    problem: {
      pl: "Sklep online z kilkudziesięcioma zamówieniami dziennie. Faktury były wystawiane i wysyłane ręcznie – łatwo coś pominąć, dużo klikania i chaos w skrzynce.",
      en: "An online store with dozens of orders per day. Invoices were issued and sent manually – easy to miss something, lots of clicking and inbox chaos."
    },
    solution: {
      pl: "Połączyliśmy sklep z systemem faktur. Po opłaceniu zamówienia faktura wystawia się automatycznie, a klient otrzymuje ją mailem bez ręcznej wysyłki. Właściciel ma spójną numerację i statusy.",
      en: "We integrated the store with the invoicing system. After payment, the invoice is generated automatically and sent to the customer by email. The owner has consistent numbering and statuses."
    },
    results: [
      {
        pl: "~4–6 godzin miesięcznie mniej na „wystaw fakturki”",
        en: "~4–6 hours less per month spent on invoicing"
      },
      {
        pl: "Mniej pomyłek, zero „zapomniałem wysłać”",
        en: "Fewer mistakes, no more “I forgot to send the invoice”"
      },
      {
        pl: "Właściciel skupia się na sprzedaży, a nie na przeklikiwaniu",
        en: "Owner focuses on sales instead of clicking around systems"
      }
    ]
  },
  {
    industry: { pl: "Agencja Reklamowa", en: "Advertising Agency" },
    problem: { 
      pl: "Account Managerowie tracili 3 dni w miesiącu na ręczne robienie raportów w Excelu dla klientów.", 
      en: "Account Managers wasted 3 days/month manually creating Excel reports for clients." 
    },
    solution: { 
      pl: "Agregacja danych z FB/Google Ads do BigQuery -> Looker Studio + Komentarz generowany przez GPT-4.", 
      en: "Data aggregation FB/Google Ads -> BigQuery -> Looker Studio + GPT-4 generated commentary." 
    },
    results: [
      { pl: "Raporty dostępne online 24/7", en: "Reports available online 24/7" },
      { pl: "Odzyskanie ~24h pracy managera", en: "Reclaimed ~24h of manager work" }
    ]
  }
];

export const TECH_STACK_LABELS = {
  title: { pl: "Technologie, które łączymy", en: "Technologies We Connect" },
  subtitle: { 
    pl: "Nie musisz wymieniać całego oprogramowania. My sprawiamy, że Twoje obecne narzędzia zaczynają ze sobą współpracować.", 
    en: "You don't need to replace all your software. We make your current tools start working together." 
  }
};

export const TESTIMONIALS: Testimonial[] = [
  {
    text: { 
      pl: "Proces fakturowania zajmował nam tydzień każdego miesiąca. Inteli-IT zredukowało to do... pełnej automatyzacji w tle. Najlepsza inwestycja roku.", 
      en: "Invoicing took us a week every month. Inteli-IT reduced it to... full background automation. Best investment of the year." 
    },
    author: "Marek K.",
    role: "CEO",
    company: "Logistics Hub Sp. z o.o."
  },
  {
    text: { 
      pl: "Bałam się, że AI to tylko marketingowy szum. Pokazali mi, jak AI może wstępnie kwalifikować maile od klientów. Oszczędzam 2h dziennie.", 
      en: "I was afraid AI was just marketing hype. They showed me how AI can pre-qualify client emails. I save 2h daily." 
    },
    author: "Anna Z.",
    role: "Head of Sales",
    company: "Creative Flow"
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: { pl: "Czy to bezpieczne dla moich danych?", en: "Is this safe for my data?" },
    answer: { 
      pl: "Tak. Korzystamy z szyfrowanych połączeń (API), a modele AI konfigurujemy tak, by nie trenowały się na Twoich danych (Enterprise Privacy).", 
      en: "Yes. We use encrypted connections (API), and configure AI models so they don't train on your data (Enterprise Privacy)." 
    }
  },
  {
    question: { pl: "Od czego zacząć, jeśli nic nie mamy?", en: "Where do we start if we have nothing?" },
    answer: { 
      pl: "Od audytu 'Low Hanging Fruits'. Znajdujemy jeden proces, który zabiera najwięcej czasu i jest najprostszy do wdrożenia.", 
      en: "From a 'Low Hanging Fruits' audit. We find one process that takes the most time and is easiest to implement." 
    }
  },
  {
    question: { pl: "Czy muszę zatrudniać programistę?", en: "Do I need to hire a developer?" },
    answer: { 
      pl: "Nie. Dostarczamy rozwiązanie 'pod klucz' i bierzemy odpowiedzialność za jego utrzymanie (Support).", 
      en: "No. We deliver a 'turnkey' solution and take responsibility for its maintenance (Support)." 
    }
  },
  {
    question: { pl: "Ile trwa wdrożenie?", en: "How long does implementation take?" },
    answer: { 
      pl: "Proste automatyzacje (np. fakturowanie) wdrażamy w 5-10 dni roboczych. Złożone systemy CRM/ERP to 4-8 tygodni.", 
      en: "Simple automations (e.g., invoicing) take 5-10 business days. Complex CRM/ERP systems take 4-8 weeks." 
    }
  }
];

export const CONTACT_FORM = {
  title: { pl: "Porozmawiajmy o konkretach", en: "Let’s Talk Specifics" },
  subtitle: { 
    pl: "Wypełnij formularz. W ciągu 24h (dni robocze) wrócimy z pomysłem na pierwszy krok.", 
    en: "Fill out the form. Within 24h (business days), we'll return with an idea for the first step." 
  },
  fields: {
    name: { pl: "Imię i Nazwisko", en: "Full Name" },
    company: { pl: "Nazwa Firmy i WWW", en: "Company Name & Website" },
    email: { pl: "Służbowy E-mail", en: "Work Email" },
    role: { pl: "Twoje stanowisko", en: "Your Job Title" },
    size: { pl: "Wielkość zespołu (np. 15, 50, 200)", en: "Team Size (e.g. 15, 50, 200)" },
    problem: { pl: "Jaki proces zabiera Wam najwięcej czasu? (Opisz krótko)", en: "Which process eats up most of your time? (Short desc)" },
    date: { pl: "Kiedy możemy zadzwonić?", en: "When can we call?" },
    submit: { pl: "Wyślij zgłoszenie", en: "Send Request" }
  },
  consent: {
    pl: "Klikając 'Wyślij', zgadzasz się na kontakt w celu omówienia automatyzacji w Twojej firmie.",
    en: "By clicking 'Send', you agree to be contacted to discuss automation in your company."
  }
};

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'api-integrations',
    title: { pl: "API i Integracje", en: "API & Integrations" },
    description: { 
      pl: "Jak systemy rozmawiają ze sobą bez udziału człowieka. Fundament nowoczesnej firmy.",
      en: "How systems talk to each other without humans. The foundation of a modern company."
    },
    icon: Network,
    items: [
      {
        problem: { pl: "Ręczne przepisywanie danych z maila do Excela.", en: "Manually copying data from email to Excel." },
        solution: { pl: "Systemy połączone przez API wymieniają dane w ułamku sekundy.", en: "API-connected systems exchange data in a split second." },
        benefit: { pl: "100% poprawności danych", en: "100% data accuracy" }
      },
      {
        problem: { pl: "Logowanie się do 5 różnych paneli, żeby sprawdzić status.", en: "Logging into 5 diff dashboards to check status." },
        solution: { pl: "Jeden centralny dashboard pobierający dane automatycznie.", en: "One central dashboard fetching data automatically." },
        benefit: { pl: "Oszczędność 1h dziennie", en: "Save 1h daily" }
      }
    ]
  },
  {
    id: 'workflows',
    title: { pl: "Workflow (Make/n8n)", en: "Workflows (Make/n8n)" },
    description: { 
      pl: "Cyfrowe taśmy produkcyjne. Sekwencje zdarzeń, które dzieją się same.",
      en: "Digital assembly lines. Sequences of events that happen automatically."
    },
    icon: Workflow,
    items: [
      {
        problem: { pl: "Gdy wpada lead, handlowiec musi pamiętać o wysłaniu oferty.", en: "When lead comes, rep must remember to send quote." },
        solution: { pl: "Workflow sam wykrywa leada, tworzy draft oferty i powiadamia handlowca.", en: "Workflow detects lead, drafts quote, notifies rep." },
        benefit: { pl: "Szybsza obsługa klienta", en: "Faster customer service" }
      },
      {
        problem: { pl: "Księgowość ściga za brakujące faktury kosztowe.", en: "Accounting chases for missing cost invoices." },
        solution: { pl: "Automat skanuje skrzynkę mailową, pobiera załączniki PDF i wrzuca je na Drive/Dropbox.", en: "Bot scans inbox, downloads PDFs, and uploads to Drive/Dropbox." },
        benefit: { pl: "Porządek w dokumentach", en: "Organized documents" }
      }
    ]
  },
  {
    id: 'ai-agents',
    title: { pl: "Agenci AI (LLM)", en: "AI Agents (LLM)" },
    description: { 
      pl: "Inteligentni wirtualni pracownicy, którzy rozumieją tekst, kontekst i intencje.",
      en: "Intelligent virtual workers who understand text, context, and intent."
    },
    icon: Cpu,
    items: [
      {
        problem: { pl: "Konieczność czytania setek maili dziennie.", en: "Reading hundreds of emails daily." },
        solution: { pl: "AI kategoryzuje maile, odpisuje na proste i flaguje pilne.", en: "AI categorizes, replies to simple ones, flags urgent." },
        benefit: { pl: "Czysta skrzynka odbiorcza", en: "Inbox Zero" }
      },
      {
        problem: { pl: "Pracownicy ciągle pytają 'gdzie jest wniosek urlopowy?'.", en: "Employees keep asking 'where is the vacation form?'." },
        solution: { pl: "Chatbot wewnętrzny z bazą wiedzy (PDF) odpowiada na pytania proceduralne.", en: "Internal chatbot with KB (PDF) answers procedural questions." },
        benefit: { pl: "HR oszczędza 5h/tyg", en: "HR saves 5h/week" }
      }
    ]
  }
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "API (Application Programming Interface)",
    definition: { 
      pl: "Cyfrowa wtyczka, która pozwala dwóm różnym programom (np. Twojemu sklepowi i firmie kurierskiej) bezpiecznie wymieniać się informacjami.",
      en: "A digital plug that allows two different programs (e.g., your store and courier) to securely exchange information."
    },
    analogy: {
      pl: "To jak kelner w restauracji. Ty (klient) nie wchodzisz do kuchni (baza danych). Zamawiasz przez kelnera (API), a on przynosi gotowe danie.",
      en: "It's like a waiter. You don't go into the kitchen. You order via the waiter (API), and they bring the dish."
    }
  },
  {
    term: "Webhook",
    definition: { 
      pl: "Automatyczny sygnał wysyłany przez system, gdy coś się wydarzy (np. 'Nowe zamówienie!'). To 'dzwonek do drzwi' dla automatyzacji.",
      en: "An automatic signal sent when something happens (e.g. 'New Order!'). It's a 'doorbell' for automation."
    },
    analogy: {
      pl: "Zamiast co 5 minut sprawdzać skrzynkę pocztową (Polling), dostajesz powiadomienie SMS, gdy listonosz wrzuci list.",
      en: "Instead of checking your mailbox every 5 mins (Polling), you get a text when the mailman drops a letter."
    }
  },
  {
    term: "LLM (Large Language Model)",
    definition: { 
      pl: "Zaawansowany model sztucznej inteligencji (jak GPT-4), który potrafi czytać, rozumieć i tworzyć tekst na poziomie zbliżonym do ludzkiego.",
      en: "Advanced AI model (like GPT-4) that can read, understand, and create text at a near-human level."
    },
    analogy: {
      pl: "To jak super-oczytany stażysta, który przeczytał cały internet, ale potrzebuje precyzyjnych instrukcji, co ma zrobić.",
      en: "Like a super-read intern who read the whole internet but needs precise instructions on what to do."
    }
  }
];

// --- MOCK DATABASE FOR CLIENT PANEL ---

export const MOCK_CLIENT_DATA = {
  user: {
    id: "usr_123",
    name: "Jan Kowalski",
    email: "jan@example.com",
    company: "Example Logistics Sp. z o.o.",
    role: "admin",
    avatar: "JK"
  } as User,
  services: [
    { id: "srv_01", name: "Automatyzacja Faktur (OCR)", status: "active", nextBilling: "2025-06-01", uptime: "99.9%", type: "automation" },
    { id: "srv_02", name: "Chatbot HR", status: "active", nextBilling: "2025-06-01", uptime: "99.5%", type: "ai-agent" },
    { id: "srv_03", name: "Integracja BaseLinker <-> ERP", status: "maintenance", nextBilling: "2025-06-15", uptime: "98.0%", type: "automation" }
  ] as ClientService[],
  invoices: [
    { id: "inv_102", number: "FV/2025/05/12", date: "2025-05-01", amount: 2500, currency: "PLN", status: "unpaid", downloadUrl: "#" },
    { id: "inv_101", number: "FV/2025/04/10", date: "2025-04-01", amount: 2500, currency: "PLN", status: "paid", downloadUrl: "#" },
    { id: "inv_100", number: "FV/2025/03/08", date: "2025-03-01", amount: 2500, currency: "PLN", status: "paid", downloadUrl: "#" }
  ] as Invoice[],
  contracts: [
    { id: "ctr_01", title: "Umowa Wdrożeniowa & SLA", dateSigned: "2025-01-15", validUntil: "2026-01-15", status: "active", type: "service" },
    { id: "ctr_02", title: "Umowa Poufności (NDA)", dateSigned: "2025-01-10", validUntil: "Bezterminowo", status: "active", type: "nda" }
  ] as Contract[]
};
