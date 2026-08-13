import "server-only"

import { isOdooConfigured } from "@/lib/odoo/client"
import { jsonProductRepository } from "./json-product-repository"
import { jsonCategoryRepository } from "./json-category-repository"
import { odooProductRepository } from "./odoo-product-repository"
import { odooCategoryRepository } from "./odoo-category-repository"

// Use Odoo whenever both server-side credentials are configured. The JSON
// repositories remain a safe fallback so the upstream starter still builds.
export const productRepository = isOdooConfigured()
  ? odooProductRepository
  : jsonProductRepository

export const categoryRepository = isOdooConfigured()
  ? odooCategoryRepository
  : jsonCategoryRepository

export { jsonBrandRepository as brandRepository } from "./json-brand-repository"
export { jsonPageRepository as pageRepository } from "./json-page-repository"
export { jsonBlogRepository as blogRepository } from "./json-blog-repository"
