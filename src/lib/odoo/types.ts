export interface OdooApiErrorPayload {
  code: string
  message: string
}

export interface OdooApiResponse<T> {
  success: boolean
  data: T
  meta?: Record<string, number>
  error?: OdooApiErrorPayload
}

export interface OdooCategory {
  id: number
  name: string
  parent_id: number | null
  slug: string
  image_url: string | null
}

export interface OdooProductSummary {
  id: number
  name: string
  slug: string
  website_url: string
  sku: string | null
  price: number
  currency: string
  in_stock: boolean | null
  variant_count: number
  category_ids: number[]
  image_url: string
  updated_at: string | null
}

export interface OdooAttributeValue {
  id: number
  name: string
  attribute: string
}

export interface OdooVariant {
  id: number
  name: string
  sku: string | null
  price: number
  in_stock: boolean | null
  attribute_values: OdooAttributeValue[]
  image_url: string
}

export interface OdooProductDetail extends OdooProductSummary {
  short_description: string | null
  description_html: string | null
  variants: OdooVariant[]
  attributes: Array<{
    id: number
    name: string
    values: Array<{ id: number; name: string }>
  }>
}

export interface OdooProductListMeta {
  page: number
  limit: number
  total: number
  page_count: number
}
