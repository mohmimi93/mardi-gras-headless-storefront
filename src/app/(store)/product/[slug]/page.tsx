import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { productRepository, categoryRepository, brandRepository } from "@/lib/repositories"
import { formatPrice } from "@/lib/utils"
import { siteConfig } from "@/lib/config"
import { ProductDetailView } from "../../[slug]/product-detail-view"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await productRepository.getBySlug(slug)
  if (!product) return { title: "Product Not Found" }

  const variant = product.variants[0]
  return {
    title: product.name,
    description: product.description || `Shop ${product.name}.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description || `Shop ${product.name}.`,
      type: "website",
      url: `${siteConfig.url}/product/${product.slug}`,
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.images[0].alt }]
        : [],
    },
    other: {
      "product:price:amount": variant ? String(variant.price / 100) : "",
      "product:price:currency": variant?.currency ?? "USD",
      "product:price:display": variant
        ? formatPrice(variant.price, variant.currency)
        : "",
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await productRepository.getBySlug(slug)
  if (!product) notFound()

  const productCategories = await Promise.all(
    product.categoryIds.map((id) => categoryRepository.getById(id))
  )
  const validCategories = productCategories.filter(
    (category): category is NonNullable<typeof category> => category !== null
  )
  const primaryCategory =
    validCategories.find((category) => category.parentId) ??
    validCategories[0] ??
    null

  const [relatedProducts, brand, categoryAncestors] = await Promise.all([
    primaryCategory
      ? productRepository
          .getByCategory(primaryCategory.slug, { page: 1, limit: 5 })
          .then((result) =>
            result.items.filter((item) => item.id !== product.id).slice(0, 4)
          )
      : Promise.resolve([]),
    product.brandId
      ? brandRepository.getById(product.brandId)
      : Promise.resolve(null),
    primaryCategory
      ? categoryRepository.getAncestors(primaryCategory.id)
      : Promise.resolve([]),
  ])

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
      brand={brand}
      categoryAncestors={categoryAncestors}
    />
  )
}
