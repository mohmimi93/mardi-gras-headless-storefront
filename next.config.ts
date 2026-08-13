import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { redirects as redirectRules } from "./src/lib/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const odooUrl = process.env.ODOO_BASE_URL
  ? new URL(process.env.ODOO_BASE_URL)
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: odooUrl
      ? [
          {
            protocol: odooUrl.protocol === "http:" ? "http" : "https",
            hostname: odooUrl.hostname,
            port: odooUrl.port,
            pathname: "/web/image/**",
          },
        ]
      : [],
  },

  // Prevent a package-lock.json in a parent Windows folder from being
  // incorrectly selected as the Turbopack workspace root.
  turbopack: {
    root: process.cwd(),
  },

  // Redirects are defined in src/lib/redirects.ts — edit there.
  async redirects() {
    return redirectRules;
  },
};

export default withNextIntl(nextConfig);
