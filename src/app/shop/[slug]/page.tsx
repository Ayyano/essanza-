import { categories, getCategoryBySlug } from '@/lib/categories';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryPageClient } from './category-client';

export async function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} | ESSANZA Pakistan`,
    description: category.description,
    openGraph: {
      title: `${category.name} | ESSANZA Pakistan`,
      description: category.description,
      images: [{ url: category.image }],
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  return <CategoryPageClient category={category} />;
}
