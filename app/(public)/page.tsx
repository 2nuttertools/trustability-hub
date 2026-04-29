import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { FeaturedProjects } from "@/components/featured-projects";
import { Categories } from "@/components/categories";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";
import { ArticlesSection } from "@/components/articles-section";
import { CtaSection } from "@/components/cta-section";
import { getProjects, getArticles, getTestimonials } from "@/lib/data";

export const revalidate = 60; // ISR: refresh every minute

export default async function HomePage() {
  const [projects, articles, testimonials] = await Promise.all([
    getProjects(),
    getArticles(3),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProjects projects={projects} />
      <Categories />
      <WhyUs />
      <Testimonials testimonials={testimonials} />
      <ArticlesSection articles={articles} />
      <CtaSection />
    </>
  );
}
