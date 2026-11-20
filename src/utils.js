export function getRandomNumberBetween(min, max) {
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);

  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

export function eventTargetInsideElementTag(
  event,
  tags = ["button", "a", "input", "iframe"]
) {
  let targetElement = event.target;

  while (targetElement != null) {
    if (tags.includes(targetElement.nodeName.toLowerCase())) {
      return true;
    }

    targetElement = targetElement.parentNode;
  }

  return false;
}

export const COLLECTION_IDS = {
  CDS: "503978754336",
  VINYL: "503978787104",
  CASSETTES: "503978819872",
  OTHER: "503978852640",
};

export const CDN_URL = "https://w-img.b-cdn.net/rtr";
// Until this moment the proxy sends the regular site to the /soon countdown.
// GODHANDUSA pages are not gated by it.
export const RELEASE_DATE = Date.parse("2026-11-20T15:00:00-05:00"); // 3PM New York
export const GODHANDUSA_RELEASE_DATE = Date.parse("10 Jul 2026 14:00:00 EDT");
export const GODHANDUSA_COLLECTION_ID = "gid://shopify/Collection/517340037408";

// Resize a Shopify CDN image via URL query params instead of a GraphQL
// transform. Passing width + height without a crop preserves aspect ratio,
// matching the maxWidth/maxHeight transform behavior.
export function shopifyImageUrl(url, { width, height, crop } = {}) {
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);

    if (width) {
      parsed.searchParams.set("width", String(width));
    }

    if (height) {
      parsed.searchParams.set("height", String(height));
    }

    if (crop) {
      parsed.searchParams.set("crop", crop);
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

export function isSafari() {
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const macOS = /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor);
  const safariDesktop =
    /Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua);

  return iOS || macOS || safariDesktop;
}

export function isLive() {
  return Date.now() > RELEASE_DATE;
}

const saleTag = {
  id: "SALE",
  label: "Sale",
  image: "/images/sale.png",
  width: 263,
};
const lowStockTag = {
  id: "LOWSTOCK",
  label: "Low Stock",
  image: `${CDN_URL}/images/low-stock.png`,
  width: 389,
};

export function getProductTag({ tags, variants }) {
  if (
    tags?.includes(saleTag.id) ||
    variants.some(
      ({ availableForSale, price, compareAtPrice }) =>
        availableForSale && Number(compareAtPrice) > Number(price),
    )
  ) {
    return saleTag;
  }

  return tags?.includes(lowStockTag.id) ? lowStockTag : null;
}

// The original price to cross out next to a product's displayed price, as a
// number. The displayed price is the cheapest variant's, so this is null
// unless an available variant at that price is marked down.
export function getCompareAtPrice({ variants }) {
  const lowestPrice = Math.min(...variants.map(({ price }) => Number(price)));
  const markedDown = variants.find(
    ({ availableForSale, price, compareAtPrice }) =>
      availableForSale &&
      Number(price) === lowestPrice &&
      Number(compareAtPrice) > lowestPrice,
  );

  return markedDown ? Number(markedDown.compareAtPrice) : null;
}
