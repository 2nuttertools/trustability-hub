import projectsJson from "@/data/projects.json";
import articlesJson from "@/data/articles.json";
import testimonialsJson from "@/data/testimonials.json";
import { getSql, isDbConfigured } from "./db";

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
// Postgres-backed accessors with JSON fallback.
// - When DB is configured, projects table is the source of truth.
// - On first deploy the table is empty → JSON used until admin saves anything.
// - Once admin edits in /admin, those rows live in Postgres permanently.
// =====================================================================
async function dbProjects(): Promise<Project[] | null> {
  if (!isDbConfigured) return null;
  try {
    const sql = getSql();
    const rows = await sql<{ data: Project }[]>`
      select data from projects
      order by featured desc, sort_order asc, updated_at desc
    `;
    if (rows.length === 0) return null;
    return rows.map((r) => r.data);
  } catch (err) {
    console.warn("[data] DB read failed, falling back to JSON:", (err as Error).message);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  const fromDb = await dbProjects();
  return fromDb ?? sortedProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isDbConfigured) {
    try {
      const sql = getSql();
      const rows = await sql<{ data: Project }[]>`select data from projects where slug = ${slug} limit 1`;
      if (rows[0]) return rows[0].data;
    } catch {
      // fall through to JSON
    }
  }
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
  const projects = (await dbProjects()) ?? allProjects;
  const params: { slug: string; type: string }[] = [];
  for (const p of projects) {
    if (!p.houseTypes) continue;
    for (const h of p.houseTypes) {
      params.push({ slug: p.slug, type: h.slug });
    }
  }
  return params;
}

export async function getProjectSlugs(): Promise<string[]> {
  const fromDb = await dbProjects();
  if (fromDb) return fromDb.map((p) => p.slug);
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
