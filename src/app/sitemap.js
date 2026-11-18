import Shopify from "@/shopify";
import { SITE_URL } from "@/metadata";
import { productUrl } from "@/product-seo";

export const dynamic = "force-dynamic";

// Storefront API page size limit. The whole catalog fits in one page.
const MAX_PRODUCTS = 250;

// The collections linked from the menu.
const COLLECTION_HANDLES = ["cds", "vinyl", "cassettes"];

export default async function sitemap() {
  const [products, policies] = await Promise.all([
    Shopify.getProducts(MAX_PRODUCTS),
    Shopify.getPolicies(),
  ]);

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/archive` },
    { url: `${SITE_URL}/godhandusa` },
    { url: `${SITE_URL}/contact` },
    ...COLLECTION_HANDLES.map((handle) => ({
      url: `${SITE_URL}/collections/${handle}`,
    })),
    // A policy the shop has not written yet comes back as null.
    ...Object.values(policies)
      .filter(Boolean)
      .map((policy) => ({ url: `${SITE_URL}/policies/${policy.handle}` })),
    ...products.results.map((product) => ({
      url: productUrl(product),
      lastModified: product.updatedAt,
    })),
  ];
}
