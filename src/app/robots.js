import { SITE_URL } from "@/metadata";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/password", "/soon"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
