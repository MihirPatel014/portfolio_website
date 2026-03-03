export interface SocialLink {
    platform: string;
    url: string;
}

export interface PersonalDetails {
    name: string;
    role: string;
    tagline: string;
    socialLinks: SocialLink[];
    availability: string;
    resumeUrl: string;
    profileImage?: string;
    bio?: string;
    aboutImage?: string;
}

export interface Section {
    id: string;
    title: string;
    enabled: boolean;
}

export interface ProjectLinks {
    github: string;
    live: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    featured: boolean;
    image?: string;
    links: ProjectLinks;
    status: 'active' | 'archived';
}

export interface SkillItem {
    name: string;
    level: number;
}

export interface SkillGroup {
    category: string;
    items: SkillItem[];
}

export interface ExperienceEntry {
    company: string;
    role: string;
    duration: string;
    highlights: string[];
}

export interface PortfolioData {
    personal: PersonalDetails;
    sections: Section[];
    projects: Project[];
    skills: SkillGroup[];
    experience: ExperienceEntry[];
}
