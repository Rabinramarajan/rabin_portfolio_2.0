export type SocialPlatform = 'github' | 'linkedin' | 'email';

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  email: string;
  availability: string;
  summary: string;
  portraitUrl: string;
  socials: SocialLink[];
  stats: Stat[];
}

export interface Principle {
  title: string;
  description: string;
}

export interface NavItem {
  label: string;
  path: string;
}
