export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  score: string;
}

export interface Project {
  title: string;
  techStack: string;
  description: string;
  links?: {
    github?: string;
    live?: string;
  };
  award?: string;
}

export interface Certification {
  name: string;
  date: string;
}

export interface SkillCategory {
  category: string;
  items: string;
}

export interface ResumeData {
  name: string;
  role: string;
  contact: ContactInfo;
  objective: string;
  education: Education[];
  skills: SkillCategory[]; 
  projects: Project[];
  certifications: Certification[];
  languages: string;
  interests: string;
}