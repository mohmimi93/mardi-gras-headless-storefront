import "server-only"

import type {
  PaginatedResult,
  PaginationParams,
  Product,
  ProductFilters,
  ProductRepository,
  SortOption,
} from "@/types"
import { odooRequest } from "@/lib/odoo/client"
import {
  mapOdooProductDetail,
  mapOdooProductSummary,
} from "@/lib/odoo/mappers"
import type {
  OdooProductDetail,
  OdooProductListMeta,
  OdooProductSummary,
} from "@/lib/odoo/types"
import { odooCategoryRepository } from "./odoo-category-repository"

function emptyResult<T>(pagination?: PaginationParams): PaginatedResult<T> {
  const page = pagination?.page ?? 1
  const limit = pagination?.limit ?? 12
  return {
    items: [],
    pagination: {
      total: 0,
      page,
      limit,
      totalPages: 0,
      hasNext: false,
      hasPrev: page > 1,
    },
  }
}

function odooSort(sort?: SortOption): string {
  if (!sort) return "featured"
  if (sort.field === "price") return sort.order === "asc" ? "price_asc" : "price_desc"
  if (sort.field === "name") return sort.order === "asc" ? "name_asc" : "name_desc"
  if (sort.field === "createdAt") return "newest"
  return "featured"
}

async function listProducts(
  filters?: ProductFilters,
  sort?: SortOption,
  pagination?: PaginationParams
): Promise<PaginatedResult<Product>> {
  const page = Math.max(pagination?.page ?? 1, 1)
  const limit = Math.min(Math.max(pagination?.limit ?? 12, 1), 100)
  let categoryId: string | undefined

  if (filters?.category) {
    const category = await odooCategoryRepository.getBySlug(filters.category)
    if (!category) return emptyResult({ page, limit })
    categoryId = category.id
  }

  const response = await odooRequest<OdooProductSummary[]>(
    "/headless/v1/products",
    {
      page,
      limit,
      search: filters?.search?.trim() || undefined,
      category_id: categoryId,
      sort: odooSort(sort),
    }
  )
  const meta = response.meta as unknown as OdooProductListMeta
  const items = response.data.map(mapOdooProductSummary)

  return {
    items,
    pagination: {
      total: meta.total,
      page: meta.page,
      limit: meta.limit,
      totalPages: meta.page_count,
      hasNext: meta.page < meta.page_count,
      hasPrev: meta.page > 1,
    },
  }
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await odooRequest<OdooProductDetail>(
      `/headless/v1/products/${encodeURIComponent(slug)}`
    )
    return mapOdooProductDetail(response.data)
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) {
      return null
    }
    throw error
  }
}

export const odooProductRepository: ProductRepository = {
  list: listProducts,

  getBySlug: getProductBySlug,

  async getById(id) {
    return getProductBySlug(`product-${id}`)
  },

  async getFeatured(limit = 4) {
    const result = await listProducts(undefined, undefined, { page: 1, limit })
    return result.items
  },

  async getByCategory(categorySlug, pagination) {
    return listProducts({ category: categorySlug }, undefined, pagination)
  },

  async search(query, pagination) {
    return listProducts({ search: query }, undefined, pagination)
  },
}
