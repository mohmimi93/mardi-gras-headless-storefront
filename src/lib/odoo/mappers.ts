import type { Category, Product, ProductImage, ProductVariant } from "@/types"
import type {
  OdooCategory,
  OdooProductDetail,
  OdooProductSummary,
  OdooVariant,
} from "./types"

const FALLBACK_DATE = "1970-01-01T00:00:00.000Z"

function toCents(amount: number): number {
  return Math.round(amount * 100)
}

function inventory(inStock: boolean | null) {
  return {
    quantity: inStock === false ? 0 : 999,
    trackInventory: false,
    allowBackorder: inStock !== false,
  }
}

function image(url: string | null | undefined, alt: string): ProductImage[] {
  return url ? [{ url, alt }] : []
}

function summaryVariant(product: OdooProductSummary): ProductVariant {
  return {
    id: `template-${product.id}`,
    productId: String(product.id),
    sku: product.sku ?? "",
    name: product.variant_count > 1 ? `${product.variant_count} options` : "Default",
    price: toCents(product.price),
    currency: product.currency,
    inventory: inventory(product.in_stock),
    options: [],
    images: image(product.image_url, product.name),
  }
}

function detailVariant(
  variant: OdooVariant,
  product: OdooProductDetail
): ProductVariant {
  const options = variant.attribute_values.map((value) => ({
    name: value.attribute,
    value: value.name,
  }))

  return {
    id: String(variant.id),
    productId: String(product.id),
    sku: variant.sku ?? "",
    name: options.length
      ? options.map((option) => option.value).join(" / ")
      : "Default",
    price: toCents(variant.price),
    currency: product.currency,
    inventory: inventory(variant.in_stock),
    options,
    images: image(variant.image_url, variant.name),
  }
}

export function mapOdooProductSummary(product: OdooProductSummary): Product {
  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    description: "",
    images: image(product.image_url, product.name),
    status: "active",
    brandId: "",
    categoryIds: product.category_ids.map(String),
    tags: [],
    variants: [summaryVariant(product)],
    rating: 0,
    reviewCount: 0,
    featured: true,
    createdAt: product.updated_at ?? FALLBACK_DATE,
    updatedAt: product.updated_at ?? FALLBACK_DATE,
  }
}

export function mapOdooProductDetail(product: OdooProductDetail): Product {
  const variants = product.variants.map((variant) =>
    detailVariant(variant, product)
  )
  const productImages = [
    ...image(product.image_url, product.name),
    ...variants.flatMap((variant) => variant.images),
  ].filter(
    (candidate, index, all) =>
      all.findIndex((item) => item.url === candidate.url) === index
  )

  return {
    ...mapOdooProductSummary(product),
    description: product.short_description ?? "",
    body: product.description_html ?? undefined,
    images: productImages,
    variants,
  }
}

export function mapOdooCategory(
  category: OdooCategory,
  order: number
): Category {
  return {
    id: String(category.id),
    name: category.name,
    slug: category.slug,
    description: "",
    image: category.image_url
      ? { url: category.image_url, alt: category.name }
      : undefined,
    parentId: category.parent_id ? String(category.parent_id) : undefined,
    order,
  }
}
