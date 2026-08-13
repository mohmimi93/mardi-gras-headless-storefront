import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/config"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "New Arrivals", href: "/shop?sort=newest" },
    { name: "Wishlist", href: "/wishlist" },
  ],
  help: [
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Shipping Policy", href: "/policies/shipping" },
    { name: "Returns & Refunds", href: "/policies/returns" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/policies/privacy" },
    { name: "Terms of Service", href: "/policies/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-semibold tracking-tight">
              {siteConfig.name}
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>
          {Object.entries(footerLinks).map(([label, links]) => (
            <div key={label}>
              <h3 className="text-sm font-semibold capitalize">{label}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <p className="text-xs text-muted-foreground">
          &copy; {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
