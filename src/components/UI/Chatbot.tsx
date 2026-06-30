import React, { useState, useRef, useEffect } from 'react';
import { Settings, X, MessageCircle, Bot, Send, Loader2, Trash2 } from 'lucide-react';
import { profileData } from '../../data/profileData';

// ---------- Fuzzy-match utils ----------
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(prev + (a[i - 1] === b[j - 1] ? 0 : 1), dp[j] + 1, dp[j - 1] + 1);
      prev = tmp;
    }
  }
  return dp[n];
}

function fuzzyIn(text: string, token: string, threshold = 0.75): boolean {
  const window = token.length;
  for (let i = 0; i <= text.length - window; i++) {
    if (levenshtein(text.slice(i, i + window), token) <= Math.floor((1 - threshold) * window)) {
      return true;
    }
  }
  return false;
}

function matches(query: string, patterns: (RegExp | string)[]): boolean {
  return patterns.some(p =>
    typeof p === 'string'
      ? fuzzyIn(query, p)
      : p.test(query)
  );
}

// ---------- Structured knowledge base ----------
interface KnowledgeEntry {
  requires: (RegExp | string)[];
  answer: string;
}

function kbEntries(kb: ReadonlyArray<KnowledgeEntry>): (q: string) => string | null {
  return (q: string) => {
    for (const entry of kb) {
      if (matches(q, entry.requires)) return entry.answer;
    }
    return null;
  };
}

// Derive all answers from profileData so they stay in sync automatically
const allProjects = profileData.projects;
const allSkills = profileData.skills;
const allExperiences = profileData.experiences;
const allEducation = profileData.education;
const allCertificates = profileData.certificates;
const allPublications = profileData.publications;
const contact = profileData.contact;
const pibProject = allProjects.find(p => /pib|multilingual|press/i.test(p.title));
const ragProject = allProjects.find(p => /rag|offline|multimodal|document/i.test(p.title));

const knowledgeBase: ReadonlyArray<KnowledgeEntry> = [
  // --- Greetings ---
  {
    requires: [/\b(hi|hello|hey|greetings|sup|yo|howdy|good\s*morning|good\s*evening|good\s*afternoon)\b/i],
    answer: "Hey! 👋 Great to see you! What would you like to know about Aryan?",
  },

  // --- Farewell ---
  {
    requires: [/\b(bye|goodbye|see\s*you|later|take\s*care|cya)\b/i],
    answer: "Thanks for chatting! 👋 Don't forget to check out Aryan's projects!",
  },

  // --- Thanks ---
  {
    requires: [/\b(thanks|thank\s*you|thx|ty|appreciate)\b/i],
    answer: "You're welcome! 😊 Anything else you'd like to know?",
  },

  // --- Help ---
  {
    requires: [/\b(help|what\s*can\s*you|what\s*do\s*you|capabilit)\b/i],
    answer: `I can tell you about everything on Aryan's portfolio:\n\n• 🧠 Skills & tech stack (${allSkills.length} skills)\n• 🚀 ${allProjects.length}+ projects\n• 💼 ${allExperiences.length} work experiences\n• 🎓 Education\n• ${allCertificates.length}+ certifications\n• 📄 ${allPublications.length} publications\n• 📬 Contact & social links\n\nJust ask naturally — I handle typos and rephrasing too!`,
  },

  // --- Jokes ---
  {
    requires: [/\b(joke|funny|laugh|humor)\b/i],
    answer: [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
      "How many programmers does it take to change a bulb? None — that's hardware! 💡",
      "Why do Java devs wear glasses? Because they can't C#! 😎",
      "A SQL query walks into a bar… Can I JOIN you? 🍺",
      "Why did the dev go broke? Used up all his cache! 💸",
      "UX goes to a coffee shop… 'The cup is too big!' 'Actually, it's *micro.' ☕",
    ][Math.floor(Math.random() * 6)],
  },

  // --- WHO IS ARYAN / ABOUT ---
  {
    requires: [/\b(who\s*is\s*aryan|who\s*are\s*you|what\s*are\s*you|your\s*name|about\s*aryan|tell\s*me\s*about|bio|summary)\b/i],
    answer: `Aryan Mishra — AI & ML Specialist & Full-Stack Developer 🌟\n\n• ${allSkills.length}+ technical skills (Python 90%, HTML 90%…)\n• ${allProjects.length}+ major projects — from facial recognition to 5G ML simulation\n• ${allExperiences.length} internships / roles\n• ${allCertificates.length}+ professional certifications\n• ${allPublications.length} academic publications\n• Final-semester B.Tech (CS + AI/ML) @ Presidency University\n\nOpen to ML, SDE, and Full-Stack roles. Reach him at ${contact.email}`,
  },

  // --- ALL SKILLS ---
  {
    requires: [/\b(skill|tech\s*stack|programming|language|know|proficien)\b/i],
    answer: (() => {
      const sorted = [...allSkills].sort((a, b) => b.level - a.level);
      const top = sorted.slice(0, 6);
      return `Top skills (${sorted.length} total):\n\n${top
        .map(s => `• ${s.name}: ${s.level}%`)
        .join('\n')}\n\nAsk "does he know <tech>" to check a specific one!`;
    })(),
  },

  // --- SPECIFIC SKILL (checking) ---
  {
    requires: [/\b(does\s*he\s*know|can\s*he|is\s*he\s*good\s*at|knows\s*)\s*.+/i],
    answer: (q: string) => {
      const term = q
        .replace(/does\s*he\s*know|can\s*he|is\s*he\s*good\s*at|knows\s*/gi, '')
        .replace(/[?.,!]+$/g, '')
        .trim();
      if (!term) return "Which skill are you asking about? Name it and I'll check!";
      const found = allSkills.filter(s =>
        fuzzyIn(s.name.toLowerCase(), term.toLowerCase().replace(/s$/, ''), 0.6)
      );
      if (found.length === 0) return `I couldn't find anything matching "${term}" in his skill list. Try another spelling?`;
      return found
        .map(s => `• ${s.name}: ${s.level}%`)
        .join('\n');
    },
  },

  // --- ALL PROJECTS ---
  {
    requires: [/\b(project|built|created|developed|portfolio|app|system|platform)\b/i],
    answer: (() => {
      const list = allProjects.slice(0, 6).map(p => `• ${p.title}`).join('\n');
      return `Aryan has ${allProjects.length}+ projects. Highlights:\n\n${list}\n\nAsk "tell me about [project name]" for full details on any one!`;
    })(),
  },

  // --- SPECIFIC PROJECT: PIB ---
  {
    requires: [/\b(pib|multilingual|press\s*release|video\s*platform)\b/i],
    answer: `🎥 PIB Multilingual Video Platform\n\n${
      pibProject?.description || ''
    }\n\n🔗 researchgate.net/publication/403865959`,
  },

  // --- SPECIFIC PROJECT: RAG / OFFLINE ---
  {
    requires: [/\b(offline|rag|multimodal|document\s*intelligence|air\s*gapped|secure\s*document)\b/i],
    answer: `🔐 Offline Multimodal RAG — Document Intelligence\n\n${
      ragProject?.description || ''
    }\n\n🔗 github.com/Aryan0854/Offline-Multimodal-RAG-System`,
  },

  // --- SPECIFIC PROJECT: THALACARE ---
  {
    requires: [/\b(thala|thalassemia|healthcare|medical\s*ai|health)\b/i],
    answer: (`❤️ ThalaCare AI Assistant\n\n${
      allProjects.find(p => /thala/i.test(p.title))?.description
    }` ?? "A healthcare-focused AI platform."),
  },

  // --- SPECIFIC PROJECT: FACE RECOGNITION ---
  {
    requires: [/\b(face\s*recognition|missing\s*person|aadhaar|biometric|award\s*winning)\b/i],
    answer: `🏆 Facial Recognition System\n\n${allProjects.find(p => /face/i.test(p.title))?.description || ''}\n\nAwarded "Best Societal Relevant Project" 🏅`,
  },

  // --- SPECIFIC PROJECT: 5G ---
  {
    requires: [/\b(5g|network\s*simulation|telecom|q.learning|reinforcement)\b/i],
    answer: `📡 5G Network Simulation Framework\n\n${allProjects.find(p => /5g|simulation/i.test(p.title))?.description || ''}`,
  },

  // --- SPECIFIC PROJECT: CSV ---
  {
    requires: [/\b(csv|data\s*automation|data\s*pipeline|dash)\b/i],
    answer: `📊 CSV-Automated Dashboard\n\n${allProjects.find(p => /csv/i.test(p.title))?.description || ''}`,
  },

  // --- SPECIFIC PROJECT: WEATHER ---
  {
    requires: [/\b(weather|forecast|climate|prediction\s*platform|xgboost|lstm)\b/i],
    answer: `🌤️ Weather Prediction Platform\n\n${allProjects.find(p => /weather/i.test(p.title))?.description || ''}`,
  },

  // --- SPECIFIC PROJECT: SQL DASHBOARD ---
  {
    requires: [/\b(sql\s*dashboard|database\s*management|server\s*monitor|heavy\s*process)\b/i],
    answer: `🗄️ SQL Database Management Dashboard\n\n${allProjects.find(p => /sql\s*database/i.test(p.title))?.description || ''}`,
  },

  // --- PUBLICATION ---
  {
    requires: [/\b(publication|research\s*paper|researchgate|published)\b/i],
    answer: (() => {
      const pubs = allPublications.map(p =>
        `📄 **${p.title}**\n   ${p.period}\n   ${p.link}`
      ).join('\n\n');
      return `Aryan has ${allPublications.length} publications:\n\n${pubs}`;
    })(),
  },

  // --- EXPERIENCE / INTERNSHIP ---
  {
    requires: [/\b(experience|internship|interned|worked|job|company|role|work)\b/i],
    answer: (q: string) => {
      // Specific company matches
      for (const exp of allExperiences) {
        if (fuzzyIn(q, exp.company.split(',')[0].replace(/[^a-z]/gi, ''), 0.55)) {
          return `💼 **${exp.title}** at **${exp.company}**\n${exp.period}\n\n${exp.description}`;
        }
      }
      // General list
      const list = allExperiences.map(e => `• ${e.title} — ${e.company} (${e.period})`).join('\n');
      return `💼 Work Experience (${allExperiences.length} roles):\n\n${list}\n\nAsk "tell me about [company]" for full details!`;
    },
  },

  // --- EDUCATION ---
  {
    requires: [/\b(education|university|college|degree|study|school|presidency|hiranandani|b.tech)\b/i],
    answer: (() => {
      return allEducation.map(e => `🎓 **${e.degree}**\n   ${e.institution}\n   ${e.period}\n   ${e.description}`).join('\n\n');
    })(),
  },

  // --- CERTIFICATIONS ---
  {
    requires: [/\b(cert|certific|achievement|coursera|udemy|google\s*cert|oracle|microsoft|ibm|deloitte)\b/i],
    answer: (q: string) => {
      const specificProvider = ['google', 'oracle', 'microsoft', 'ibm', 'deloitte', 'linux', 'tcs']
        .find(p => fuzzyIn(q, p, 0.6));
      const filtered = specificProvider
        ? allCertificates.filter(c => fuzzyIn(c.title.toLowerCase(), specificProvider, 0.5))
        : allCertificates.slice(0, 6);
      const list = filtered.map(c => `🏆 ${c.title}\n   Issued by: ${c.issuer} (${c.date})`).join('\n');
      return allCertificates.length >= 6
        ? `${allCertificates.length}+ certifications — highlights:\n\n${list}\n…and ${allCertificates.length - filtered.length} more!\n\nFilter by provider: "google certs", "microsoft certs", etc.`
        : `Certifications:\n\n${list}`;
    },
  },

  // --- CONTACT ---
  {
    requires: [/\b(contact|email|phone|reach|connect|location|where|address)\b/i],
    answer: `📬 **Contact Aryan:**\n\n📧 ${contact.email}\n📱 ${contact.phone}\n📍 ${contact.location}\n\n💼 LinkedIn: ${contact.linkedinLink}\n💻 GitHub: ${contact.githubLink}\n\nFeel free to reach out! 🚀`,
  },

  // --- SOCIAL MEDIA ---
  {
    requires: [/\b(linkedin|github|social|twitter|facebook|x\.com|insta)\b/i],
    answer: (q: string) => {
      if (fuzzyIn(q, 'linkedin', 0.6)) return `💼 LinkedIn: ${contact.linkedinLink}\n\nActive with 743+ followers — check out his recommendations!`;
      if (fuzzyIn(q, 'github', 0.6)) return `💻 GitHub: ${contact.githubLink}\n\nRepos covering AI/ML, web apps, data science, cybersecurity, and more!`;
      if (fuzzyIn(q, 'twitter', 0.6) || fuzzyIn(q, 'x.com', 0.6)) return `🐦 X / Twitter: ${contact.twitter}`;
      if (fuzzyIn(q, 'facebook', 0.6)) return `📘 Facebook: ${contact.facebook}`;
      return `Here are Aryan's social profiles:\n\n💼 LinkedIn: ${contact.linkedinLink}\n💻 GitHub: ${contact.githubLink}\n🐦 Twitter: ${contact.twitter}\n📘 Facebook: ${contact.facebook}`;
    },
  },

  // --- AVAILABILITY / CURRENT STATUS ---
  {
    requires: [/\b(current|now|present|doing|available|open|hire|hiring|seeking|looking\s*for)\b/i],
    answer: `🎯 **Current Status:**\n• Final semester B.Tech (CS + AI/ML) at Presidency University\n• Last completed: Capgemini — Cloud Infrastructure Associate\n• **Actively seeking** ML / SDE / Full-Stack roles\n• Available after graduation (Nov 2026)\n\n📧 ${contact.email}`,
  },

  // --- ACHIEVEMENTS ---
  {
    requires: [/\b(achievement|award|recognition|won|best|honour|accolade)\b/i],
    answer: `🏆 **Awards & Achievements:**\n\n• "Best Societal Relevant Project" — 400+ submissions\n• Facial Recognition: 92%+ accuracy\n• Raspberry Pi certification\n• 25+ industry certifications\n• LOR from every internship\n• 743+ LinkedIn followers`,
  },

  // --- HOW MANY ---
  {
    requires: [/\bhow\s*many\b/i],
    answer: (q: string) => {
      if (fuzzyIn(q, 'project')) return `🚀 ${allProjects.length}+ major projects!`;
      if (fuzzyIn(q, 'cert', 0.6) || fuzzyIn(q, 'qualification')) return `🏆 ${allCertificates.length}+ certifications!`;
      if (fuzzyIn(q, 'skill')) return `💻 ${allSkills.length}+ technical skills!`;
      if (fuzzyIn(q, 'intern') || fuzzyIn(q, 'experience')) return `💼 ${allExperiences.length} internships + roles!`;
      if (fuzzyIn(q, 'publication') || fuzzyIn(q, 'paper') || fuzzyIn(q, 'research')) return `📄 ${allPublications.length} publications!`;
      if (fuzzyIn(q, 'year') || fuzzyIn(q, 'age')) return `Aryan was born in 2003, making him ~23 years old. He's in his final semester of B.Tech (2022-2026).`;
      return `He's accomplished a lot! Try asking "how many projects" or "how many certifications"?`;
    },
  },

  // --- RESUMÉ / CV ---
  {
    requires: [/\b(resume|cv|download)\b/i],
    answer: `📄 You can download Aryan's CV from the Resume page on this website! Or email him directly at ${contact.email}`,
  },

  // --- PORTFOLIO / SITE ---
  {
    requires: [/\b(portfolio|website|this\s*site|site)\b/i],
    answer: `He built this entire portfolio himself! 💻 React + TypeScript + Tailwind CSS. The chatbot is also his creation — running fully offline, no external API needed! 🤖`,
  },

  // --- HOBBIES / INTERESTS ---
  {
    requires: [/\b(hobb|interest|freetime|free\s*time|outside\s*work|passion)\b/i],
    answer: `🌱 Aryan is passionate about:\n• AI for social good (facial recognition for missing persons)\n• Contributing to open-source projects\n• Exploring cutting-edge AI / ML research\n• IoT & smart cities`,
  },

  // --- LOCATION ---
  {
    requires: [/\b(location|where|live|based|from|city|bengaluru|bangalore)\b/i],
    answer: `📍 Bengaluru (Bangalore), Karnataka, India — India's Silicon Valley! 🏙️\nOpen to relocating for the right opportunity.`,
  },

  // --- OPEN TO WORK ---
  {
    requires: [/\b(hire|hiring|recruit|opportunity|role|position|job\s*open)\b/i],
    answer: `🚀 Aryan is open to roles in:\n\n🤖 Machine Learning / AI Engineering\n💻 Software Development Engineering (SDE)\n🌐 Full-Stack Development\n\nEmail: ${contact.email}\nLinkedIn: ${contact.linkedinLink}\n\nHe's available after Nov 2026!`,
  },
  // --- BOT IDENTITY / CREATOR ---
  {
    requires: [/\b(are\s*you|your\s*maker|who\s*created|who\s*made|chatbot|ai|bot|real|human|creator)\b/i],
    answer: "I'm a fully local AI assistant designed by Aryan to help you navigate his portfolio. I can answer questions about his B.Tech, ML projects, certifications, and experience!",
  },
];

const matcher = kbEntries(knowledgeBase);

// ---------- Fallback: find closest match by question similarity ----------
function fallbackResponse(query: string): string {
  const qWords = query.toLowerCase().split(/[^\w]+/).filter(w => w.length > 2);
  if (qWords.length === 0) {
    return `Hmm, I'm not totally sure what you're asking 🧐\n\nBut here's what I know about Aryan — pick a topic:\n\n• Skills & tech\n• Projects\n• Work experience\n• Education\n• Certifications\n• Publications\n• Contact info\n\nType "help" for more info!`;
  }

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    
    // 1. Check regex tests (highest priority)
    for (const pattern of entry.requires) {
      if (pattern instanceof RegExp) {
        if (pattern.test(query)) score += 10;
      } else if (typeof pattern === 'string') {
        if (query.toLowerCase().includes(pattern.toLowerCase())) score += 5;
      }
    }

    // 2. Word matches in the answer text
    const answerLower = typeof entry.answer === 'string' 
      ? entry.answer.toLowerCase() 
      : '';
    
    for (const qw of qWords) {
      if (answerLower.includes(qw)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore >= 2) {
    const ans = typeof bestEntry.answer === 'function' ? bestEntry.answer(query) : bestEntry.answer;
    return ans + "\n\n💡 _(Was this what you were looking for? Feel free to ask more details!)_";
  }

  return `Hmm, I'm not totally sure what you're asking 🧐\n\nBut here's what I know about Aryan — pick a topic:\n\n• Skills & tech\n• Projects\n• Work experience\n• Education\n• Certifications\n• Publications\n• Contact info\n\nType "help" for more info!`;
}

// ---------- Component ----------
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hey! 👋 I'm Aryan's AI assistant — ask me anything about his skills, projects, experience, or any topic below!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // --- Fuzzy word→synonym expansion ---
  const synonyms: Record<string, string[]> = {
    'email': ['email', 'mail', 'reach', 'contact', 'connect', 'message'],
    'emails': ['email', 'mail', 'reach', 'contact', 'connect', 'message'],
    'mail': ['email', 'mail', 'reach', 'contact', 'connect', 'message'],
    'mails': ['email', 'mail', 'reach', 'contact', 'connect', 'message'],
    'phone': ['phone', 'call', 'number', 'contact', 'mobile', 'cell'],
    'phones': ['phone', 'call', 'number', 'contact', 'mobile', 'cell'],
    'call': ['phone', 'call', 'number', 'contact', 'mobile', 'cell'],
    'contact': ['contact', 'reach', 'connect', 'email', 'phone', 'address', 'location'],
    'contacts': ['contact', 'reach', 'connect', 'email', 'phone', 'address', 'location'],
    'address': ['location', 'where', 'live', 'city', 'bengaluru', 'bangalore', 'address'],
    'location': ['location', 'where', 'live', 'city', 'bengaluru', 'bangalore', 'address'],
    'skill': ['skill', 'tech', 'stack', 'know', 'language', 'programming', 'proficien'],
    'skills': ['skill', 'tech', 'stack', 'know', 'language', 'programming', 'proficien'],
    'tech': ['skill', 'tech', 'stack', 'know', 'language', 'programming', 'proficien'],
    'stack': ['skill', 'tech', 'stack', 'know', 'language', 'programming', 'proficien'],
    'know': ['skill', 'tech', 'stack', 'know', 'language', 'programming', 'proficien'],
    'language': ['skill', 'tech', 'stack', 'know', 'language', 'programming', 'proficien'],
    'languages': ['skill', 'tech', 'stack', 'know', 'language', 'programming', 'proficien'],
    'project': ['project', 'app', 'built', 'building', 'made', 'created', 'developed', 'system', 'platform'],
    'projects': ['project', 'app', 'built', 'building', 'made', 'created', 'developed', 'system', 'platform'],
    'app': ['project', 'app', 'built', 'building', 'made', 'created', 'developed', 'system', 'platform'],
    'apps': ['project', 'app', 'built', 'building', 'made', 'created', 'developed', 'system', 'platform'],
    'system': ['project', 'app', 'built', 'building', 'made', 'created', 'developed', 'system', 'platform'],
    'platform': ['project', 'app', 'built', 'building', 'made', 'created', 'developed', 'system', 'platform'],
    'intern': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'interns': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'internship': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'internships': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'work': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'experience': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'experiences': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'job': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'jobs': ['intern', 'interned', 'work', 'worked', 'job', 'experience', 'company', 'role'],
    'cert': ['cert', 'certific', 'achievement', 'coursera', 'udemy'],
    'certs': ['cert', 'certific', 'achievement', 'coursera', 'udemy'],
    'certificate': ['cert', 'certific', 'achievement', 'coursera', 'udemy'],
    'certificates': ['cert', 'certific', 'achievement', 'coursera', 'udemy'],
    'certification': ['cert', 'certific', 'achievement', 'coursera', 'udemy'],
    'certifications': ['cert', 'certific', 'achievement', 'coursera', 'udemy'],
    'pib': ['pib', 'multilingual', 'press', 'video'],
    'face': ['face', 'recognition', 'missing', 'aadhaar', 'biometric'],
    'thala': ['thala', 'thalassemia', 'healthcare', 'medical'],
    'weather': ['weather', 'forecast', 'climate', 'prediction'],
    'rag': ['rag', 'offline', 'multimodal', 'document'],
    '5g': ['5g', 'network', 'simulation', 'telecom'],
    'csv': ['csv', 'dashboard', 'data'],
    'sql': ['sql', 'database'],
    'education': ['education', 'university', 'college', 'degree', 'study', 'school'],
    'availability': ['available', 'open', 'seeking', 'hiring', 'hire'],
    'seek': ['available', 'open', 'seeking', 'hiring', 'hire'],
  };

  const buildRichQuery = (raw: string): string => {
    const tokens = raw.toLowerCase().split(/\s+/);
    const expanded = tokens.flatMap(t => synonyms[t] ?? [t]);
    const ordered = [...new Set(expanded)];
    return ordered.join(' ');
  };

  const generateResponse = (query: string): string => {
    const q = buildRichQuery(query);

    // first pass: direct regex matcher
    const matched = matcher(q);
    if (matched !== null) {
      if (typeof matched === 'function') {
        try { return matched(query); } catch (_) { /* fall through */ }
      }
      return matched;
    }

    // second pass: fallback against regex-filtered candidates
    return fallbackResponse(query);
  };

  const handleSendMessage = () => {
    const trimmed = inputValue.trim();
    if (trimmed.toLowerCase() === 'clear' || trimmed.toLowerCase() === 'reset') {
      handleClearChat();
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const sent = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    const variation = 250 + Math.random() * 400;
    setTimeout(() => {
      const response = generateResponse(sent);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, variation);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '0',
        text: "Chat cleared! 👋 Ask me anything new about Aryan.",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 max-w-[calc(100vw-2rem)]">
      {isOpen ? (
        <div className="bg-[#11151f]/95 backdrop-blur-xl rounded-3xl shadow-2xl w-[92vw] max-w-sm sm:w-80 sm:max-w-md h-[72vh] max-h-[580px] flex flex-col border border-white/10 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6366f1]/80 via-[#8b5cf6]/80 to-[#a855f7]/80 backdrop-blur-md text-white p-4 flex items-center justify-between shrink-0 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-bold text-xs border border-white/10">
                AI
              </div>
              <div>
                <span className="font-semibold block text-sm leading-tight">Aryan's Assistant</span>
                <span className="text-[10px] opacity-80 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(99,102,241,0.8)]"></span>
                  Replies instantly
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Clear chat"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Info"
              >
                <Settings size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-black/20 to-black/45 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white rounded-br-none shadow-[0_4px_12px_rgba(99,102,241,0.2)]'
                      : 'bg-white/[0.04] backdrop-blur-sm text-gray-200 border border-white/5 rounded-bl-none shadow-sm'
                  }`}
                >
                  {message.text.split('\n').map((line, i) => {
                    const urlRegex = /(https?:\/\/[^\s<]+|(?:github\.com|linkedin\.com|researchgate\.net|mail\.google\.com|gmail\.com)[^\s<]*)/gi;
                    const urlParts = line.split(urlRegex);
                    return (
                      <div key={i} className="mb-0.5 last:mb-0">
                        {urlParts.map((urlPart, j) => {
                          const isUrl = /^(https?:\/\/)?(github\.com|linkedin\.com|researchgate\.net|mail\.google\.com|gmail\.com)[^\s<]*$/i.test(urlPart) || /^https?:\/\/[^\s<]+$/i.test(urlPart);
                          if (isUrl) {
                            const hrefUrl = /^[a-z]+:\/\//i.test(urlPart) ? urlPart : `https://${urlPart}`;
                            return (
                              <a
                                key={`${i}-${j}`}
                                href={hrefUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${message.sender === 'user' ? 'text-indigo-200 hover:text-white' : 'text-indigo-400 hover:underline'} font-medium break-all`}
                              >
                                {urlPart.replace(/^https?:\/\//, '')}
                              </a>
                            );
                          }
                          const emailParts = urlPart.split(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g);
                          return (
                            <React.Fragment key={`${i}-${j}`}>
                              {emailParts.map((ep, k) =>
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(ep)
                                  ? (
                                    <a
                                      key={`${i}-${j}-${k}`}
                                      href={`mailto:${ep}`}
                                      className={`${message.sender === 'user' ? 'text-indigo-200 hover:text-white' : 'text-indigo-400 hover:underline'} font-medium`}
                                    >
                                      {ep}
                                    </a>
                                  )
                                  : <span key={`${i}-${j}-${k}`}>{ep}</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/[0.04] backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-none border border-white/5 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 size={13} className="animate-spin text-indigo-400" />
                    <span className="text-xs text-gray-400">Assistant is thinking…</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-black/30 border-t border-white/5 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about skills, projects, experience..."
                className="flex-1 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white/[0.03] text-white placeholder-gray-500 transition-all leading-relaxed"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-md shrink-0"
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a855f7] text-white w-14 h-14 rounded-full shadow-2xl hover:shadow-[0_8px_30px_rgba(99,102,241,0.4)] transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label="Open chatbot"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-indigo-400 rounded-full border-2 border-[#0b0e14] animate-pulse shadow-[0_0_6px_rgba(99,102,241,0.6)]"></span>
        </button>
      )}

      {/* Settings Info Dialog */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in" onClick={() => setShowSettings(false)}>
          <div className="bg-[#11151f] border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot size={18} className="text-indigo-400" />
                Offline AI Engine
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-indigo-500/5 rounded-xl p-3.5 border border-indigo-500/10 text-gray-300 leading-relaxed">
                This chatbot is built using rule-based templates, synonym mappings, and Levenshtein distance calculations. It processes requests completely locally without server-side resources.
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white">Ask Aryan's bot about:</h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1.5"><span className="text-indigo-400">🧠</span> Skills ({allSkills.length} techs)</span>
                  <span className="flex items-center gap-1.5"><span className="text-indigo-400">🚀</span> Projects ({allProjects.length} total)</span>
                  <span className="flex items-center gap-1.5"><span className="text-indigo-400">💼</span> Experience ({allExperiences.length} jobs)</span>
                  <span className="flex items-center gap-1.5"><span className="text-indigo-400">🏆</span> Certs ({allCertificates.length} items)</span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-gray-400">
                <p className="font-semibold text-gray-300 mb-1.5 text-[11px]">💡 Query Examples:</p>
                <div className="flex flex-wrap gap-1">
                  {['Tell me about PIB project', 'What are his top skills?', 'Email links', 'Certificates list'].map(q => (
                    <span key={q} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] cursor-default border border-indigo-500/10">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-5 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-2.5 rounded-xl transition-colors text-xs font-semibold"
            >
              Resume Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
