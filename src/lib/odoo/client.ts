import "server-only"

import { env } from "@/lib/env"
import type { OdooApiResponse } from "./types"

export class OdooApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code = "odoo_api_error"
  ) {
    super(message)
    this.name = "OdooApiError"
  }
}

export function isOdooConfigured(): boolean {
  return Boolean(env.ODOO_BASE_URL && env.ODOO_HEADLESS_API_TOKEN)
}

function getOdooConfig() {
  if (!env.ODOO_BASE_URL || !env.ODOO_HEADLESS_API_TOKEN) {
    throw new OdooApiError(
      "Odoo is not configured. Add ODOO_BASE_URL and ODOO_HEADLESS_API_TOKEN to .env.local.",
      500,
      "odoo_not_configured"
    )
  }

  return {
    baseUrl: env.ODOO_BASE_URL.replace(/\/$/, ""),
    token: env.ODOO_HEADLESS_API_TOKEN,
  }
}

export async function odooRequest<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>
): Promise<OdooApiResponse<T>> {
  const { baseUrl, token } = getOdooConfig()
  const url = new URL(path, `${baseUrl}/`)

  for (const [name, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(name, String(value))
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  let payload: OdooApiResponse<T> | null = null
  try {
    payload = (await response.json()) as OdooApiResponse<T>
  } catch {
    throw new OdooApiError(
      `Odoo returned a non-JSON response (${response.status}).`,
      response.status
    )
  }

  if (!response.ok || !payload.success) {
    throw new OdooApiError(
      payload.error?.message ?? `Odoo request failed (${response.status}).`,
      response.status,
      payload.error?.code
    )
  }

  return payload
}
