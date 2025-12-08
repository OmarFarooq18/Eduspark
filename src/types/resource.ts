export interface ResourceLink {
  type: 'video' | 'notes';
  url: string;
  title: string;
}

export interface Resource {
  id: number;
  title: string;
  type: string;
  subject: string;
  rating: number;
  reviews: number;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  links: ResourceLink[];
}

export interface Subject {
  id: number;
  name: string;
}

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';
