import { z } from "zod"

// Validate environment variables at build/startup time.
// Add required vars here as you integrate real services.

const envSchema = z.object({
  // Required
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Optional — add validation as you integrate services
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),

  // Odoo credentials are server-side only. Both must be present together.
  ODOO_BASE_URL: z.string().url().optional(),
  ODOO_HEADLESS_API_TOKEN: z.string().min(20).optional(),

  // Uncomment when integrating a payment provider:
  // STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  // STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),

}).refine(
  (value) =>
    Boolean(value.ODOO_BASE_URL) === Boolean(value.ODOO_HEADLESS_API_TOKEN),
  {
    message: "ODOO_BASE_URL and ODOO_HEADLESS_API_TOKEN must be configured together",
    path: ["ODOO_BASE_URL"],
  }
)

export type Env = z.infer<typeof envSchema>

function validateEnv() {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error(
      "❌ Invalid environment variables:",
      result.error.flatten().fieldErrors
    )
    throw new Error("Invalid environment variables")
  }

  return result.data
}

export const env = validateEnv()
