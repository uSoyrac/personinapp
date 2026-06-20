/**
 * Canonical public site URL. Drives SEO (canonical/OG/sitemap/robots) and
 * Stripe redirect URLs. Set NEXT_PUBLIC_SITE_URL in production to your domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://practiceforge.com"
).replace(/\/$/, "");
