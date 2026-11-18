import { SITE_IMAGE, SITE_NAME, SITE_URL } from "./metadata.js";
import { GODHANDUSA_COLLECTION_ID } from "./utils.js";

// GODHANDUSA merch only lives under /godhandusa, so that is its canonical home.
export function productPath(product) {
  const base = (product.collectionIds ?? []).includes(GODHANDUSA_COLLECTION_ID)
    ? "/godhandusa/products"
    : "/products";

  return `${base}/${encodeURIComponent(product.handle)}`;
}

export function productUrl(product) {
  return new URL(productPath(product), SITE_URL).href;
}

// Shopify's dedicated SEO fields take precedence. The fallback never flattens
// the rich description: its plain-text form joins lines together and reads
// badly in a search result.
export function productSearchMetadata(product) {
  const name =
    product.productType &&
    !product.title.toLowerCase().includes(product.productType.toLowerCase())
      ? `${product.title} ${product.productType}`
      : product.title;

  return {
    title: product.seo?.title?.trim() || name,
    description:
      product.seo?.description?.trim() ||
      `${name} from ${SITE_NAME}, the official store for music by Joshua Hamilton. View photos, details and current availability.`,
  };
}

// Shopify alt text here is a short caption like "FRONT", which says nothing
// without the product name next to it.
export function productImageAlt(product, index = 0) {
  const caption = product.imageAltTexts?.[index]?.trim();

  return caption ? `${product.title} - ${caption}` : product.title;
}

// schema.org Product with one Offer per variant, so search results can show
// the real price and whether the item is sold out.
export function productStructuredData(product) {
  const url = productUrl(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name: product.title,
    description: productSearchMetadata(product).description,
    image: product.images,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(product.productType ? { category: product.productType } : {}),
    offers: product.variants.map((variant) => ({
      "@type": "Offer",
      url,
      ...(variant.title === "Default Title" ? {} : { name: variant.title }),
      ...(variant.sku ? { sku: variant.sku } : {}),
      price: Number(variant.price).toFixed(2),
      priceCurrency: product.currencyCode,
      availability: `https://schema.org/${
        variant.availableForSale ? "InStock" : "OutOfStock"
      }`,
      seller: { "@type": "Organization", name: SITE_NAME },
    })),
  };
}

// A merchant-authored title must never terminate the surrounding script tag.
export function serializeStructuredData(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Everything a product page puts in <head>: its own title, description,
// canonical URL and first photo as the share image.
export function productMetadata(product) {
  const { title, description } = productSearchMetadata(product);
  const shareTitle = `${title} | ${SITE_NAME}`;
  const url = productPath(product);
  const images =
    product.images.length > 0
      ? [{ url: product.images[0], alt: productImageAlt(product) }]
      : [SITE_IMAGE];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: shareTitle,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images,
    },
  };
}
