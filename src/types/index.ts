export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  contact: {
    email: string;
    emailLink: string;
    phone: string;
    phoneLink: string;
    location: string;
    locationLink: string;
    github: string;
    githubLink: string;
    linkedin: string;
    linkedinLink: string;
    twitter?: string;
    facebook?: string;
  };
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certificates: Certificate[];
  projects: Project[];
}

export interface Skill {
  name: string;
  level: number;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  link: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveLink: string;
  githubLink: string;
}