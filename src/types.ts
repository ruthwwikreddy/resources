export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  externalLink?: string;
  promptBlocks: PromptBlock[];
  upvotes: number;
  bookmarks: number;
  copyCount: number;
  createdAt: any;
  updatedAt: any;
  authorId: string;
}

export interface PromptBlock {
  label: string;
  code: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'admin' | 'user';
  bookmarkedResources: string[];
  upvotedResources: string[];
}
