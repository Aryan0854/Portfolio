export const SITE_URL = 'https://aryanmishra.online';
export const SITE_NAME = 'Aryan Mishra Portfolio';
export const SITE_AUTHOR = 'Aryan Mishra';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/img/ME-1.png`;

export const DEFAULT_KEYWORDS = [
  'Aryan Mishra',
  'Aryan Mishra portfolio',
  'AI ML developer Bengaluru',
  'full stack developer India',
  'Python machine learning projects',
  'React TypeScript developer',
  'B.Tech AI ML Presidency University',
].join(', ');

export const pagesSeo = {
  home: {
    path: '/',
    title: 'Aryan Mishra | AI & ML Full-Stack Developer in Bengaluru',
    description:
      'Portfolio of Aryan Mishra, a Bengaluru AI & ML full-stack developer. Explore Python, React, and TypeScript projects, internships, and machine learning research.',
    keywords: DEFAULT_KEYWORDS,
  },
  projects: {
    path: '/projects',
    title: 'Projects | Aryan Mishra — AI, ML & Full-Stack Work',
    description:
      'Browse Aryan Mishra’s AI, machine learning, IoT, and full-stack projects, including offline RAG, multilingual video generation, and production hiring tools.',
    keywords:
      'Aryan Mishra projects, AI projects, machine learning portfolio, full stack projects, RAG system, Python React TypeScript',
  },
  resume: {
    path: '/resume',
    title: 'Resume | Aryan Mishra — AI & ML Developer',
    description:
      'View Aryan Mishra’s resume: B.Tech CS (AI/ML), internships at Infinite, Capgemini, Gaia, and ScanPick, plus skills in Python, React, and machine learning.',
    keywords:
      'Aryan Mishra resume, AI ML resume, full stack developer CV, Python developer Bengaluru, machine learning intern',
  },
  certificates: {
    path: '/certificates',
    title: 'Certificates | Aryan Mishra — Internships & Credentials',
    description:
      'Certificates and internships of Aryan Mishra, including Google Analytics, Oracle, Databricks, Azure DevOps, and AI/ML credentials.',
    keywords:
      'Aryan Mishra certificates, Google Analytics, Oracle, Databricks, Azure DevOps, AI ML internships',
  },
} as const;
