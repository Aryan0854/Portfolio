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
];

const matcher = kbEntries(knowledgeBase);

// ---------- Fallback: find closest match by question similarity ----------
function fallbackResponse(query: string): string {
  // Only compare against entries whose own regex actually matches the query
  const candidates = knowledgeBase
    .filter(entry => {
      try { return (entry.requires as RegExp[]).some(r => r.test(query)); } catch { return true; }
    })
    .map(e => ({ entry: e, text: e.answer.toString().replace(/\n/g, ' ').slice(0, 160) }));

  if (candidates.length === 0) {
    return `Hmm, I'm not totally sure what you're asking 🧐\n\nBut here's what I know about Aryan — pick a topic:\n\n• Skills & tech\n• Projects\n• Work experience\n• Education\n• Certifications\n• Publications\n• Contact info\n\nType "help" for more info!`;
  }

  const qWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  let bestIdx = 0;
  let bestScore = Infinity;
  for (let i = 0; i < candidates.length; i++) {
    const cWords = candidates[i].text.toLowerCase().split(/\s+/).filter(Boolean);
    const score = qWords.reduce((s, w) => {
      const hit = cWords.some(cw => levenshtein(w, cw) <= Math.max(1, Math.floor(w.length * 0.3)));
      return s + (hit ? 0 : 1);
    }, 0);
    if (score < bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  if (bestScore <= Math.max(2, Math.floor(qWords.length * 0.6))) {
    return candidates[bestIdx].entry.answer
      .toString()
      .split('\n')
      .slice(0, 5)
      .join('\n') + '\n\n💡 Want to rephrase your question? I\'ll try my best!';
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
  const wasOpenLast = useRef(false);

  const stickyLast = useRef(true);
  const isStillOpen = useRef(isOpen);
  useEffect(() => { isStillOpen.current = isOpen; }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isStillOpen.current) scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // --- Fuzzy word→synonym expansion ---
  const synonyms: Record<string, string[]> = {
    'email': ['email', 'mail', 'reach'],
    'phone': ['phone', 'call', 'number', 'contact'],
    'skill': ['skill', 'tech', 'stack', 'know', 'language'],
    'project': ['project', 'app', 'built', 'building', 'made', 'created'],
    'intern': ['intern', 'interned', 'work', 'worked', 'job'],
    'cert': ['cert', 'certific', 'achievement'],
    'pib': ['pib', 'multilingual', 'press', 'video'],
    'face': ['face', 'recognition', 'missing', 'aadhaar', 'biometric'],
    'thala': ['thala', 'thalassemia', 'healthcare', 'medical'],
    'weather': ['weather', 'forecast', 'climate', 'prediction'],
    'rag': ['rag', 'offline', 'multimodal', 'document'],
    '5g': ['5g', 'network', 'simulation', 'telecom'],
    'csv': ['csv', 'dashboard', 'data'],
    'sql': ['sql', 'database'],
    'contact': ['contact', 'reach', 'connect', 'email'],
    'availability': ['available', 'open', 'seeking', 'hiring'],
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
      console.debug('[chatbot] matched directly →', matched.toString().slice(0, 60));
      return matched;
    }

    // second pass: fallback against regex-filtered candidates
    const fb = fallbackResponse(query);
    console.debug('[chatbot] fallback →', fb.slice(0, 80));
    return fb;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
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

  // ---------- Render ----------
  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6 max-w-[calc(100vw-2rem)]">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[92vw] max-w-sm sm:w-80 sm:max-w-md h-[72vh] max-h-[580px] flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                AI
              </div>
              <div>
                <span className="font-semibold block text-sm leading-tight">Aryan's Assistant</span>
                <span className="text-xs opacity-90 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
                  Online — replies instantly
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-white/15 rounded-full transition-colors"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 hover:bg-white/15 rounded-full transition-colors"
                title="Info"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/15 rounded-full transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 space-y-3">
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}
              >
                <div
                  className={`max-w-[87%] sm:max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-md'
                  }`}
                >
                  {message.text.split('\n').map((line, i) => {
                    const urlParts = line.split(/(https?:\/\/[^\s<]+)/g);
                    return (
                      <div key={i} className="mb-0.5 last:mb-0">
                        {urlParts.map((urlPart, j) => {
                          if (/^https?:\/\/[^\s<]+$/.test(urlPart)) {
                            return (
                              <a
                                key={`${i}-${j}`}
                                href={urlPart}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${message.sender === 'user' ? 'text-yellow-100 hover:text-white' : 'text-blue-600 dark:text-blue-400 hover:underline'} font-medium break-all`}
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
                                      className={`${message.sender === 'user' ? 'text-yellow-100 hover:text-white' : 'text-blue-600 dark:text-blue-400 hover:underline'} font-medium`}
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
                <div className={`text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-700 px-3.5 py-2.5 rounded-2xl rounded-bl-md border border-gray-200 dark:border-gray-600 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <Loader2 size={14} className="animate-spin text-indigo-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Thinking…</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about Aryan… 💬"
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all leading-relaxed"
                rows={1}
                style={{ minHeight: '42px', maxHeight: '120px' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-45 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg shrink-0"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label="Open chatbot"
        >
          <MessageCircle size={26} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-gray-900 dark:border-gray-700 animate-pulse"></span>
        </button>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Bot size={20} className="text-indigo-600 dark:text-indigo-400" />
                Chatbot Info
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-2">
                  <Bot size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium text-indigo-900 dark:text-indigo-100 text-sm">Smart Rule-Based Engine</span>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  This chatbot runs completely offline. It has fuzzy matching, synonym expansion, and structured knowledge from every section of Aryan's portfolio — no external API or internet required.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">What I know about:</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    [`${allSkills.length}+ skills & levels`, '🧠'],
                    [`${allProjects.length}+ projects`, '🚀'],
                    [`${allExperiences.length} work roles`, '💼'],
                    ['Education history', '🎓'],
                    [`${allCertificates.length}+ certifications`, '🏆'],
                    [`${allPublications.length} publications`, '📄'],
                    ['Contact & social links', '📬'],
                    ['Jokes included 😄', '🤖'],
                  ].map(([label, icon]) => (
                    <div key={label} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/40 rounded-lg px-2.5 py-1.5">
                      <span>{icon}</span>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/40 rounded-xl p-3.5 text-xs text-gray-600 dark:text-gray-400">
                <p className="font-semibold mb-2 text-gray-700 dark:text-gray-300">💡 Try these:</p>
                <div className="flex flex-wrap gap-1">
                  {[
                    'What are his top skills?',
                    'Tell me about the PIB project',
                    'Where has he worked?',
                    'Does he know TensorFlow?',
                    'How many certifications?',
                    'Email Aryan',
                    'Tell me a joke',
                    'What are his publications?',
                  ].map(q => (
                    <span key={q} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-[11px]">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl transition-colors text-sm font-medium"
            >
              Let's chat! →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
