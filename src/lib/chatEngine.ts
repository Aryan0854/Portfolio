import { profileData } from '../data/profileData';
import type { Project, Experience, Certificate } from '../types';

export interface ChatTurn {
  role: 'user' | 'bot';
  text: string;
}

export interface ChatMemory {
  lastProjectId?: string;
  lastExperienceCompany?: string;
  lastCertId?: string;
  lastTopic?: 'project' | 'experience' | 'skill' | 'cert' | 'education' | 'contact' | 'hire';
}

export interface EngineReply {
  text: string;
  suggestions: string[];
  memory: ChatMemory;
}

type DocType = 'bio' | 'skill' | 'project' | 'experience' | 'education' | 'cert' | 'publication' | 'contact';

interface Doc {
  id: string;
  type: DocType;
  title: string;
  tokens: string[];
  raw: string;
}

const SYNONYMS: Record<string, string> = {
  mail: 'email',
  mails: 'email',
  emai: 'email',
  gmail: 'email',
  reach: 'contact',
  connect: 'contact',
  mobile: 'phone',
  cell: 'phone',
  number: 'phone',
  call: 'phone',
  where: 'location',
  live: 'location',
  based: 'location',
  city: 'location',
  bangalore: 'bengaluru',
  stack: 'skill',
  tech: 'skill',
  skills: 'skill',
  languages: 'skill',
  language: 'skill',
  proficient: 'skill',
  know: 'skill',
  knows: 'skill',
  projects: 'project',
  built: 'project',
  created: 'project',
  developed: 'project',
  app: 'project',
  apps: 'project',
  system: 'project',
  platform: 'project',
  intern: 'experience',
  interned: 'experience',
  internship: 'experience',
  internships: 'experience',
  job: 'experience',
  jobs: 'experience',
  work: 'experience',
  worked: 'experience',
  company: 'experience',
  role: 'experience',
  roles: 'experience',
  cert: 'certificate',
  certs: 'certificate',
  certificate: 'certificate',
  certificates: 'certificate',
  certification: 'certificate',
  certifications: 'certificate',
  paper: 'publication',
  papers: 'publication',
  research: 'publication',
  published: 'publication',
  college: 'education',
  university: 'education',
  degree: 'education',
  studied: 'education',
  school: 'education',
  resume: 'cv',
  hiring: 'hire',
  recruit: 'hire',
  opportunity: 'hire',
  available: 'hire',
  seeking: 'hire',
  opening: 'hire',
  hello: 'hi',
  hey: 'hi',
  yo: 'hi',
  howdy: 'hi',
  thanks: 'thank',
  thx: 'thank',
  bye: 'goodbye',
  cya: 'goodbye',
  later: 'goodbye',
  more: 'details',
  explain: 'details',
  demo: 'live',
  repo: 'github',
  source: 'github',
  code: 'github',
};

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are', 'was', 'were',
  'he', 'his', 'him', 'her', 'you', 'your', 'me', 'my', 'we', 'they', 'this', 'that',
  'with', 'from', 'about', 'what', 'which', 'who', 'how', 'can', 'does', 'did', 'do',
  'tell', 'give', 'show', 'list', 'any', 'some', 'also', 'just', 'please', 'pls',
]);

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .map((t) => SYNONYMS[t] ?? t)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function fuzzyScore(a: string, b: string): number {
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.82;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 0;
  let matches = 0;
  const used = new Array(longer.length).fill(false);
  for (const ch of shorter) {
    const idx = longer.split('').findIndex((c, i) => c === ch && !used[i]);
    if (idx >= 0) {
      used[idx] = true;
      matches += 1;
    }
  }
  return matches / longer.length;
}

function overlapScore(query: string[], doc: string[]): number {
  if (!query.length || !doc.length) return 0;
  let score = 0;
  for (const q of query) {
    let best = 0;
    for (const d of doc) {
      best = Math.max(best, fuzzyScore(q, d));
    }
    if (best >= 0.78) score += best;
  }
  return score;
}

function buildIndex(): Doc[] {
  const docs: Doc[] = [];

  docs.push({
    id: 'bio',
    type: 'bio',
    title: profileData.name,
    raw: `${profileData.name} ${profileData.title} ${profileData.bio} available opportunities ml sde full-stack`,
    tokens: tokenize(`${profileData.name} ${profileData.title} ${profileData.bio}`),
  });

  profileData.skills.forEach((skill, i) => {
    docs.push({
      id: `skill-${i}`,
      type: 'skill',
      title: skill.name,
      raw: `${skill.name} ${skill.level}`,
      tokens: tokenize(`${skill.name} skill programming`),
    });
  });

  profileData.projects.forEach((project) => {
    docs.push({
      id: project.id,
      type: 'project',
      title: project.title,
      raw: `${project.title} ${project.description} ${project.technologies.join(' ')} ${project.liveLink} ${project.githubLink}`,
      tokens: tokenize(`${project.title} ${project.description} ${project.technologies.join(' ')}`),
    });
  });

  profileData.experiences.forEach((exp, i) => {
    docs.push({
      id: `exp-${i}`,
      type: 'experience',
      title: `${exp.title} ${exp.company}`,
      raw: `${exp.title} ${exp.company} ${exp.period} ${exp.description}`,
      tokens: tokenize(`${exp.title} ${exp.company} ${exp.period} ${exp.description}`),
    });
  });

  profileData.education.forEach((edu, i) => {
    docs.push({
      id: `edu-${i}`,
      type: 'education',
      title: edu.degree,
      raw: `${edu.degree} ${edu.institution} ${edu.period} ${edu.description}`,
      tokens: tokenize(`${edu.degree} ${edu.institution} ${edu.period} ${edu.description}`),
    });
  });

  profileData.certificates.forEach((cert) => {
    docs.push({
      id: cert.id,
      type: 'cert',
      title: cert.title,
      raw: `${cert.title} ${cert.issuer} ${cert.date}`,
      tokens: tokenize(`${cert.title} ${cert.issuer}`),
    });
  });

  profileData.publications.forEach((pub) => {
    docs.push({
      id: pub.id,
      type: 'publication',
      title: pub.title,
      raw: `${pub.title} ${pub.description} ${pub.link}`,
      tokens: tokenize(`${pub.title} ${pub.description}`),
    });
  });

  const { contact } = profileData;
  docs.push({
    id: 'contact',
    type: 'contact',
    title: 'Contact',
    raw: `${contact.email} ${contact.phone} ${contact.location} ${contact.github} ${contact.linkedin} ${contact.twitter ?? ''} ${contact.facebook ?? ''}`,
    tokens: tokenize(`email phone contact location bengaluru github linkedin twitter facebook`),
  });

  return docs;
}

const INDEX = buildIndex();

function findProject(query: string, tokens: string[]): Project | undefined {
  let best: { project: Project; score: number } | undefined;
  for (const project of profileData.projects) {
    const hay = normalize(`${project.title} ${project.technologies.join(' ')}`);
    let score = overlapScore(tokens, tokenize(hay));
    const titleBits = normalize(project.title).split(' ').filter((w) => w.length > 3);
    if (titleBits.some((w) => normalize(query).includes(w))) score += 2.5;
    if (score > (best?.score ?? 1.4)) best = { project, score };
  }
  return best?.project;
}

function findExperience(query: string, tokens: string[]): Experience | undefined {
  let best: { exp: Experience; score: number } | undefined;
  profileData.experiences.forEach((exp) => {
    const score = overlapScore(tokens, tokenize(`${exp.company} ${exp.title}`));
    const companyKey = normalize(exp.company).split(/[,\s]/)[0];
    const bump = companyKey && normalize(query).includes(companyKey) ? 3 : 0;
    const total = score + bump;
    if (total > (best?.score ?? 1.2)) best = { exp, score: total };
  });
  return best?.exp;
}

function findSkill(query: string): { name: string; level: number } | undefined {
  const q = normalize(query);
  return profileData.skills.find((s) => {
    const name = normalize(s.name);
    return q.includes(name) || name.split(' ').some((w) => w.length > 2 && q.includes(w));
  });
}

function findCerts(tokens: string[]): Certificate[] {
  const scored = profileData.certificates
    .map((cert) => ({
      cert,
      score: overlapScore(tokens, tokenize(`${cert.title} ${cert.issuer}`)),
    }))
    .filter((x) => x.score >= 0.9)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map((x) => x.cert);
}

function formatProject(project: Project): string {
  const live = project.liveLink !== '#' ? `\nLive: ${project.liveLink}` : '\nNo public live demo — code is on GitHub.';
  const pub = project.publicationLink ? `\nPaper: ${project.publicationLink}` : '';
  return `${project.title}\n\n${project.description}\n\nStack: ${project.technologies.join(', ')}${live}\nCode: ${project.githubLink}${pub}`;
}

function formatExperience(exp: Experience): string {
  return `${exp.title} at ${exp.company}\n${exp.period}\n\n${exp.description}`;
}

function listExperiences(): string {
  const lines = profileData.experiences
    .map((e) => `• ${e.title} — ${e.company} (${e.period})`)
    .join('\n');
  return `Here are Aryan's ${profileData.experiences.length} roles:\n\n${lines}\n\nName a company if you want the full write-up.`;
}

function listProjects(): string {
  const lines = profileData.projects.map((p) => `• ${p.title}`).join('\n');
  return `${profileData.projects.length} projects:\n\n${lines}\n\nName one and I will break it down.`;
}

function isListAsk(q: string): boolean {
  return /^(name|list|show|which|what are|what were|tell me)\b/.test(q) || /\b(name them|list them|which ones|all of them|the internships|the roles|the jobs)\b/.test(q);
}

function isShortSocial(q: string): boolean {
  return /^(hi|hey|hello|yo|sup|thanks|thank you|thx|bye|goodbye|ok|okay|cool|nice|wow)$/i.test(q.trim());
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export const STARTER_CHIPS = [
  'Who is Aryan?',
  'Show top projects',
  'What are his skills?',
  'Is he open to work?',
];

export function createMemory(): ChatMemory {
  return {};
}

export function reply(userText: string, _history: ChatTurn[], memory: ChatMemory): EngineReply {
  const query = userText.trim();
  const qNorm = normalize(query);
  const tokens = tokenize(query);
  const next: ChatMemory = { ...memory };

  if (!query) {
    return { text: 'Ask me anything about Aryan — skills, projects, internships, or how to reach him.', suggestions: STARTER_CHIPS, memory: next };
  }

  if (/^(clear|reset|start over)$/i.test(query)) {
    return { text: 'Fresh start. What do you want to know about Aryan?', suggestions: STARTER_CHIPS, memory: {} };
  }

  if (isShortSocial(query) && /hi|hey|hello|yo|sup/.test(qNorm)) {
    return {
      text: pick([
        "Hey — I'm Aryan's local assistant. I can walk you through his work, stack, and how to contact him.",
        'Hi. Ask about a project, a skill, internships, or whether he is open to roles.',
      ]),
      suggestions: STARTER_CHIPS,
      memory: next,
    };
  }

  if (/thank|thx/.test(qNorm) && tokens.length <= 3) {
    return {
      text: 'Anytime. Want a project deep-dive, his CV, or a contact link next?',
      suggestions: ['Download resume', 'Best projects', 'Email'],
      memory: next,
    };
  }

  if (/goodbye|bye|cya/.test(qNorm) && tokens.length <= 3) {
    return {
      text: `Thanks for stopping by. If you want to reach Aryan later: ${profileData.contact.email}`,
      suggestions: [],
      memory: next,
    };
  }

  const wantsFollowUp = /details|more|that one|this one|same|live|github|demo|link|paper|publication|name them|list them|which ones|all of them/.test(qNorm);

  if ((isListAsk(qNorm) && /intern|experience|role|job|work/.test(qNorm)) || (wantsFollowUp && memory.lastTopic === 'experience' && /name|list|which|them|all|role|intern/.test(qNorm))) {
    next.lastTopic = 'experience';
    return {
      text: listExperiences(),
      suggestions: ['Infinite', 'Capgemini', 'Gaia'],
      memory: next,
    };
  }

  if ((isListAsk(qNorm) && /project/.test(qNorm)) || (wantsFollowUp && memory.lastTopic === 'project' && /name|list|which|them|all/.test(qNorm))) {
    next.lastTopic = 'project';
    return {
      text: listProjects(),
      suggestions: ['HR Screening Console', 'PIB project', 'Offline RAG'],
      memory: next,
    };
  }

  if (wantsFollowUp && memory.lastProjectId) {
    const project = profileData.projects.find((p) => p.id === memory.lastProjectId);
    if (project) {
      if (/live|demo/.test(qNorm)) {
        const text = project.liveLink !== '#'
          ? `Live demo for ${project.title}: ${project.liveLink}`
          : `${project.title} is not hosted publicly. Code is here: ${project.githubLink}`;
        return { text, suggestions: ['GitHub link', 'Other projects'], memory: next };
      }
      if (/github|code|repo/.test(qNorm)) {
        return { text: `GitHub for ${project.title}: ${project.githubLink}`, suggestions: ['Live demo', 'Other projects'], memory: next };
      }
      if (/paper|publication/.test(qNorm)) {
        return {
          text: project.publicationLink ? `Paper: ${project.publicationLink}` : 'No publication link on this one.',
          suggestions: ['Project details', 'Other papers'],
          memory: next,
        };
      }
      return {
        text: formatProject(project),
        suggestions: ['Live demo', 'GitHub link', 'Other projects'],
        memory: next,
      };
    }
  }

  const ranked = INDEX.map((doc) => ({
    doc,
    score: overlapScore(tokens, doc.tokens) + (qNorm.includes(normalize(doc.title).split(' ')[0] ?? '') ? 0.6 : 0),
  })).sort((a, b) => b.score - a.score);

  const top = ranked[0];
  const skillHit = findSkill(query);
  const projectHit = findProject(query, tokens);
  const expHit = findExperience(query, tokens);
  const certHits = findCerts(tokens);

  const asksHowMany = /how many/.test(qNorm);
  if (asksHowMany) {
    if (/project/.test(qNorm)) return { text: `He has ${profileData.projects.length} projects on this site, from hiring systems and offline RAG to games.`, suggestions: ['Show top projects'], memory: next };
    if (/skill/.test(qNorm)) return { text: `${profileData.skills.length} core skills are listed, led by Python and HTML at 90%.`, suggestions: ['Top skills'], memory: next };
    if (/cert/.test(qNorm)) return { text: `${profileData.certificates.length} certificates and letters are on the Certificates page.`, suggestions: ['Recent certs'], memory: next };
    if (/experience|intern/.test(qNorm)) {
      next.lastTopic = 'experience';
      return {
        text: `${profileData.experiences.length} roles — internships plus a Capgemini cloud associate stint.`,
        suggestions: ['Name the internships', 'Infinite', 'Capgemini'],
        memory: next,
      };
    }
  }

  if (/hire|open to|available|recruit|looking for|job/.test(qNorm) && !projectHit) {
    next.lastTopic = 'hire';
    return {
      text: `Yes — Aryan is open to ML, SDE, and Full-Stack roles after graduation (Nov 2026). He is in the final B.Tech semester (CS, AI/ML) at Presidency University, Bengaluru.\n\nEmail: ${profileData.contact.email}\nLinkedIn: ${profileData.contact.linkedinLink}`,
      suggestions: ['Resume', 'Top projects', 'Email'],
      memory: next,
    };
  }

  if (/cv|resume|download/.test(qNorm)) {
    return {
      text: 'Open the Resume page and use Download Offline PDF — or email him and ask for the latest CV.',
      suggestions: ['Email', 'Work experience'],
      memory: next,
    };
  }

  if (skillHit && (/skill|know|good at|proficien|python|react|java|html|css|ml|ai/.test(qNorm) || tokens.includes('skill'))) {
    next.lastTopic = 'skill';
    const band = skillHit.level >= 85 ? 'expert' : skillHit.level >= 75 ? 'advanced' : 'solid intermediate';
    return {
      text: `Yes. ${skillHit.name} is listed at ${skillHit.level}% — ${band} on his profile.`,
      suggestions: ['All skills', 'Projects using this'],
      memory: next,
    };
  }

  if (projectHit && (top?.doc.type === 'project' || /project|built|rag|pib|hr|thala|5g|csv|face|weather|sql|bizx|interview/.test(qNorm))) {
    next.lastTopic = 'project';
    next.lastProjectId = projectHit.id;
    return {
      text: formatProject(projectHit),
      suggestions: ['Another project', 'His skills', 'Is he hiring?'],
      memory: next,
    };
  }

  if (expHit && !isListAsk(qNorm) && (top?.doc.type === 'experience' || /\b(worked|company|capgemini|infinite|gaia|scanpick|xtelify|airtel)\b/.test(qNorm))) {
    next.lastTopic = 'experience';
    next.lastExperienceCompany = expHit.company;
    return {
      text: formatExperience(expHit),
      suggestions: ['All roles', 'Education'],
      memory: next,
    };
  }

  if ((certHits.length && /cert|udemy|coursera|oracle|google/.test(qNorm)) || top?.doc.type === 'cert') {
    const list = (certHits.length ? certHits : profileData.certificates.slice(0, 5))
      .map((c) => `• ${c.title} — ${c.issuer} (${c.date})`)
      .join('\n');
    next.lastTopic = 'cert';
    return {
      text: `${profileData.certificates.length} credentials on file. Here are relevant ones:\n\n${list}\n\nSee the Certificates page for the full set.`,
      suggestions: ['Education', 'Publications'],
      memory: next,
    };
  }

  if (/publication|research|paper|ieee/.test(qNorm) || top?.doc.type === 'publication') {
    const pubs = profileData.publications.map((p) => `• ${p.title} (${p.period})\n  ${p.link}`).join('\n\n');
    return {
      text: `He has ${profileData.publications.length} publications:\n\n${pubs}`,
      suggestions: ['PIB project', 'RAG project'],
      memory: next,
    };
  }

  if (/education|university|presidency|b\.?tech|degree|college/.test(qNorm) || top?.doc.type === 'education') {
    next.lastTopic = 'education';
    const text = profileData.education
      .map((e) => `${e.degree}\n${e.institution} · ${e.period}\n${e.description}`)
      .join('\n\n');
    return { text, suggestions: ['Experience', 'Skills'], memory: next };
  }

  if (/email|phone|contact|linkedin|github|twitter|facebook|location|bengaluru/.test(qNorm) || top?.doc.type === 'contact') {
    next.lastTopic = 'contact';
    const { contact } = profileData;
    if (/email/.test(qNorm)) return { text: `Email: ${contact.email}`, suggestions: ['Phone', 'LinkedIn'], memory: next };
    if (/phone/.test(qNorm)) return { text: `Phone: ${contact.phone}`, suggestions: ['Email', 'Location'], memory: next };
    if (/linkedin/.test(qNorm)) return { text: `LinkedIn: ${contact.linkedinLink}`, suggestions: ['GitHub'], memory: next };
    if (/github/.test(qNorm) && !memory.lastProjectId) return { text: `GitHub: ${contact.githubLink}`, suggestions: ['Projects'], memory: next };
    return {
      text: `Email: ${contact.email}\nPhone: ${contact.phone}\nLocation: ${contact.location}\nLinkedIn: ${contact.linkedinLink}\nGitHub: ${contact.githubLink}`,
      suggestions: ['Is he open to work?', 'Resume'],
      memory: next,
    };
  }

  if (/who is|about aryan|tell me about|bio|summary|profile/.test(qNorm) || (top?.doc.type === 'bio' && top.score > 0.8)) {
    return {
      text: `${profileData.name} is an ${profileData.title} in Bengaluru.\n\n${profileData.bio}\n\n${profileData.projects.length} projects · ${profileData.experiences.length} roles · ${profileData.certificates.length} credentials. Open to ML, SDE, and Full-Stack roles.`,
      suggestions: ['Top projects', 'Skills', 'Contact'],
      memory: next,
    };
  }

  if (/skill|stack|tech/.test(qNorm)) {
    const sorted = [...profileData.skills].sort((a, b) => b.level - a.level);
    const lines = sorted.map((s) => `• ${s.name} — ${s.level}%`).join('\n');
    next.lastTopic = 'skill';
    return { text: `Here is the listed stack:\n\n${lines}`, suggestions: ['Projects', 'Experience'], memory: next };
  }

  if (/project/.test(qNorm)) {
    const list = profileData.projects.slice(0, 6).map((p) => `• ${p.title}`).join('\n');
    return {
      text: `${profileData.projects.length} projects on the site. Highlights:\n\n${list}\n\nName one and I will break it down.`,
      suggestions: [profileData.projects[0].title.split('—')[0].trim(), 'PIB project', 'Offline RAG'],
      memory: next,
    };
  }

  if (/experience|intern|role|job/.test(qNorm) || memory.lastTopic === 'experience' && isListAsk(qNorm)) {
    next.lastTopic = 'experience';
    return {
      text: listExperiences(),
      suggestions: ['Infinite', 'Capgemini', 'Education'],
      memory: next,
    };
  }

  if (/help|what can you|what do you/.test(qNorm)) {
    return {
      text: 'I run locally on this site — no API. I can answer about Aryan’s bio, skills, projects (with links), internships, education, certificates, papers, and contact details. Follow-ups like “live demo?” or “that GitHub?” work after we pick a project.',
      suggestions: STARTER_CHIPS,
      memory: next,
    };
  }

  if (top && top.score >= 1.1) {
    if (top.doc.type === 'project') {
      const project = profileData.projects.find((p) => p.id === top.doc.id);
      if (project) {
        next.lastProjectId = project.id;
        next.lastTopic = 'project';
        return { text: formatProject(project), suggestions: ['Other projects', 'Skills'], memory: next };
      }
    }
    if (top.doc.type === 'experience') {
      const idx = Number(top.doc.id.replace('exp-', ''));
      const exp = profileData.experiences[idx];
      if (exp) {
        next.lastTopic = 'experience';
        return { text: formatExperience(exp), suggestions: ['All roles'], memory: next };
      }
    }
  }

  if (memory.lastTopic === 'experience') {
    next.lastTopic = 'experience';
    return {
      text: listExperiences(),
      suggestions: ['Infinite', 'Capgemini', 'Gaia'],
      memory: next,
    };
  }

  return {
    text: "I only know Aryan's portfolio. Ask about a project, skill, internship, certificate, or how to contact him — typos are fine.",
    suggestions: STARTER_CHIPS,
    memory: next,
  };
}
