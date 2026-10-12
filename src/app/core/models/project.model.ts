export type ProjectCategory = 'Government' | 'Enterprise' | 'Mobile' | 'Product';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  technologies: string[];
  category: ProjectCategory;
  year: string;
  featured: boolean;
  liveUrl?: string;
}
