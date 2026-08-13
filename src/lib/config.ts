// ============================================================================
// Store Configuration — Single source of truth for all store-wide settings.
// Edit this file to customize the store name, contact info, social links, etc.
// ============================================================================

export const siteConfig = {
  // Branding
  name: "Mardi Gras Apparel",
  tagline: "Mardi Gras style for the whole family.",
  description:
    "Shop Mardi Gras dresses, polos, hoodies, shirts, infant apparel, and more.",

  // Announcement bar (set to "" to hide)
  announcement: "Free shipping on qualifying orders — Shop now!",

  // URLs
  url: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",

  // Contact
  contact: {
    email: "",
    phone: "",
    address: {
      street: "",
      suite: "",
      city: "",
      state: "",
      zip: "",
    },
  },

  // Social links (set to "" to hide)
  social: {
    twitter: "",
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
  },

  // Shipping
  freeShippingThreshold: 7500, // in cents ($75.00)
  taxRate: 0.08, // 8%

  // Currency & locale
  currency: "USD",
  locale: "en-US",

  // Enabled as the matching Odoo APIs are completed.
  features: {
    checkout: false,
    customerAccounts: false,
  },

  // Legal
  copyrightYear: new Date().getFullYear(),
} as const

export type SiteConfig = typeof siteConfig
