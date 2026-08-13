import "server-only"

import type { Category, CategoryRepository } from "@/types"
import { odooRequest } from "@/lib/odoo/client"
import { mapOdooCategory } from "@/lib/odoo/mappers"
import type { OdooCategory } from "@/lib/odoo/types"

async function categories(): Promise<Category[]> {
  const response = await odooRequest<OdooCategory[]>("/headless/v1/categories")
  return response.data.map(mapOdooCategory)
}

export const odooCategoryRepository: CategoryRepository = {
  async list() {
    return categories()
  },

  async getBySlug(slug) {
    const items = await categories()
    return items.find((category) => category.slug === slug) ?? null
  },

  async getById(id) {
    const items = await categories()
    return items.find((category) => category.id === id) ?? null
  },

  async getChildren(parentId) {
    const items = await categories()
    return items.filter((category) => category.parentId === parentId)
  },

  async getTopLevel() {
    const items = await categories()
    return items.filter((category) => !category.parentId)
  },

  async getAncestors(categoryId) {
    const items = await categories()
    const ancestors: Category[] = []
    const seen = new Set<string>()
    let current = items.find((category) => category.id === categoryId)

    while (current && !seen.has(current.id)) {
      seen.add(current.id)
      ancestors.unshift(current)
      current = current.parentId
        ? items.find((category) => category.id === current?.parentId)
        : undefined
    }

    return ancestors
  },
}
