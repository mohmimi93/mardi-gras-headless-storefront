import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { productRepository, categoryRepository } from "@/lib/repositories"
import { siteConfig } from "@/lib/config"
import { CategoryView } from "../../[slug]/category-view"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await categoryRepository.getBySlug(slug)
  if (!category) return { title: "Category Not Found" }

  return {
    title: category.name,
    description: category.description || `Shop ${category.name}.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: category.name,
      description: category.description || `Shop ${category.name}.`,
      type: "website",
      url: `${siteConfig.url}/category/${category.slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = Math.max(Number(query.page) || 1, 1)
  const category = await categoryRepository.getBySlug(slug)
  if (!category) notFound()

  const [{ items: products, pagination }, subcategories, ancestors] =
    await Promise.all([
      productRepository.getByCategory(slug, { page, limit: 40 }),
      categoryRepository.getChildren(category.id),
      categoryRepository.getAncestors(category.id),
    ])

  return (
    <CategoryView
      category={category}
      products={products}
      pagination={pagination}
      subcategories={subcategories}
      ancestors={ancestors}
    />
  )
}
