export const ROUTES = {
  home: '/',
  services: '/services',
  process: '/process',
  demo: '/demo',
  caseStudies: '/case-studies',
  contact: '/contact',
  education: '/education',
  login: '/login',
  dashboard: '/dashboard',
  reset: '/reset',
} as const;

export const HOME_SECTIONS = {
  services: 'services',
  process: 'process',
  demo: 'demo',
  caseStudies: 'cases',
  contact: 'contact',
} as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[keyof typeof HOME_SECTIONS];
