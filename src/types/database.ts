export type SkillCategory =
  | "language"
  | "framework"
  | "database"
  | "devops"
  | "cloud"
  | "tool"
  | "other";

export type ProjectStatus = "concept" | "in_progress" | "shipped" | "archived";
export type PostStatus = "draft" | "published";
export type ColophonLayer =
  | "framework"
  | "hosting"
  | "database"
  | "ci"
  | "monitoring"
  | "dns"
  | "other";
export type AvailabilityStatus = "open" | "limited" | "closed";

export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string | null;
  location: string;
  availability_status: AvailabilityStatus;
  availability_message: string | null;
  avatar_url: string | null;
  resume_url: string | null;
  email_public: string | null;
  social_links: Record<string, string>;
  seo: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  icon_slug: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  location: string | null;
  description: string | null;
  highlights: string[];
  company_logo_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  gpa: string | null;
  description: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string | null;
  cover_image_url: string | null;
  tech_stack: string[];
  live_url: string | null;
  repo_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  tags: string[];
  reading_time_minutes: number | null;
  status: PostStatus;
  published_at: string | null;
  seo: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface NowEntry {
  id: string;
  content: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsesItem {
  id: string;
  category: string;
  name: string;
  description: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ColophonItem {
  id: string;
  layer: ColophonLayer;
  name: string;
  version: string | null;
  url: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  ip_hash: string | null;
  user_agent: string | null;
  read: boolean;
  archived: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  theme_default: string;
  accent_color: string;
  ga_id: string | null;
  plausible_domain: string | null;
  og_default_image: string | null;
  uptime_badge_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

// Supabase Database shape for typed client
export type Database = {
  public: {
    Tables: {
      admins: {
        Row: Admin;
        Insert: Omit<Admin, "id" | "created_at">;
        Update: Partial<Admin>;
      };
      profile: {
        Row: Profile;
        Insert: Omit<Profile, "id" | "created_at" | "updated_at">;
        Update: Partial<Profile>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, "id" | "created_at" | "updated_at">;
        Update: Partial<Skill>;
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, "id" | "created_at" | "updated_at">;
        Update: Partial<Experience>;
      };
      education: {
        Row: Education;
        Insert: Omit<Education, "id" | "created_at" | "updated_at">;
        Update: Partial<Education>;
      };
      certifications: {
        Row: Certification;
        Insert: Omit<Certification, "id" | "created_at" | "updated_at">;
        Update: Partial<Certification>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at">;
        Update: Partial<Project>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, "id" | "created_at" | "updated_at">;
        Update: Partial<BlogPost>;
      };
      now_entries: {
        Row: NowEntry;
        Insert: Omit<NowEntry, "id" | "created_at" | "updated_at">;
        Update: Partial<NowEntry>;
      };
      uses_items: {
        Row: UsesItem;
        Insert: Omit<UsesItem, "id" | "created_at" | "updated_at">;
        Update: Partial<UsesItem>;
      };
      colophon_items: {
        Row: ColophonItem;
        Insert: Omit<ColophonItem, "id" | "created_at" | "updated_at">;
        Update: Partial<ColophonItem>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, "id" | "created_at" | "read" | "archived"> & {
          read?: boolean;
          archived?: boolean;
        };
        Update: Partial<ContactMessage>;
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, "id" | "created_at" | "updated_at">;
        Update: Partial<SiteSettings>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      skill_category: SkillCategory;
      project_status: ProjectStatus;
      post_status: PostStatus;
      colophon_layer: ColophonLayer;
      availability_status: AvailabilityStatus;
    };
  };
};
