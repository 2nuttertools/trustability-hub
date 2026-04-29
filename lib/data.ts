import projectsJson from "@/data/projects.json";
import articlesJson from "@/data/articles.json";
import testimonialsJson from "@/data/testimonials.json";

export type ProjectType = "บ้านเดี่ยว" | "ทาวน์โฮม" | "คอนโด" | "Luxury Villa" | "Pool Villa";
export type ProjectStatus = "พร้อมอยู่" | "Pre-sale" | "อยู่ระหว่างก่อสร้าง";

export interface HouseType {
  slug: string;
  name: string;
  tagline: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms?: number;
  kitchens?: number;
  parking: number;
  units?: number;
  description: string;
  highlights: string[];
  cover: string;
  gallery: string[];
  floorPlan?: string;
  color?: string;
}

export interface Project {
  slug: string;
  name: string;
  nameEn: string;
  developer: string;
  type: ProjectType;
  status: ProjectStatus;
  location: string;
  district: string;
  province: string;
  priceFrom: number;
  priceTo: number;
  sizeFrom: number;
  sizeTo: number;
  bedrooms: number[];
  bathrooms: number[];
  parking: number;
  units: number;
  completionYear: number;
  cover: string;
  gallery: string[];
  description: string;
  highlights: string[];
  amenities: string[];
  nearby: { name: string; distance: string; icon: string }[];
  promotion?: string;
  tags: string[];
  rating: number;
  reviews: number;
  featured?: boolean;
  houseTypes?: HouseType[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  readTime: string;
  date: string;
}

export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

// =====================================================================
// Sources of truth — JSON files in /data, edit via GitHub web UI
// =====================================================================
const allProjects = projectsJson as Project[];
const allArticles = articlesJson as Article[];
const allTestimonials = testimonialsJson as Testimonial[];

const sortedProjects = [...allProjects].sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return 0;
});

// =====================================================================
// Async accessors — keep the shape so pages don't change.
// async lets us swap to a real DB later without touching callers.
// =====================================================================
export async function getProjects(): Promise<Project[]> {
  return sortedProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return allProjects.find((p) => p.slug === slug) ?? null;
}

export async function getHouseType(
  projectSlug: string,
  typeSlug: string,
): Promise<{ project: Project; houseType: HouseType } | null> {
  const project = await getProjectBySlug(projectSlug);
  if (!project?.houseTypes) return null;
  const houseType = project.houseTypes.find((h) => h.slug === typeSlug);
  if (!houseType) return null;
  return { project, houseType };
}

export async function getHouseTypeParams(): Promise<{ slug: string; type: string }[]> {
  const params: { slug: string; type: string }[] = [];
  for (const p of allProjects) {
    if (!p.houseTypes) continue;
    for (const h of p.houseTypes) {
      params.push({ slug: p.slug, type: h.slug });
    }
  }
  return params;
}

export async function getProjectSlugs(): Promise<string[]> {
  return allProjects.map((p) => p.slug);
}

export async function getArticles(limit = 6): Promise<Article[]> {
  return allArticles.slice(0, limit);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return allTestimonials;
}

export const developers = [
  "Sansiri", "AP Thailand", "Pruksa Real Estate", "Land & Houses", "SC Asset",
  "MQDC", "Origin Property", "Supalai",
];

// Sync re-exports for any legacy imports
export const projects = sortedProjects;
export const articles = allArticles;
export const testimonials = allTestimonials;
