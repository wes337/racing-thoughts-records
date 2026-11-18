import assert from "node:assert/strict";
import { test } from "node:test";
import {
  productImageAlt,
  productSearchMetadata,
  productStructuredData,
  productUrl,
  serializeStructuredData,
} from "../src/product-seo.js";
import { GODHANDUSA_COLLECTION_ID } from "../src/utils.js";

function product(overrides = {}) {
  return {
    handle: "sample-lp",
    title: "Artist - SAMPLE",
    productType: "Vinyl",
    currencyCode: "USD",
    description: "ON VINYLLyric Booklet",
    seo: { title: null, description: null },
    images: ["https://example.com/front.jpg"],
    imageAltTexts: ["FRONT"],
    collectionIds: [],
    variants: [
      { title: "Black", sku: "LP-BLK", price: "30.0", availableForSale: true },
      { title: "Red", sku: null, price: "35.0", availableForSale: false },
    ],
    ...overrides,
  };
}

test("search metadata prefers Shopify SEO fields and never reuses the flattened description", () => {
  const fallback = productSearchMetadata(product());
  assert.equal(fallback.title, "Artist - SAMPLE Vinyl");
  assert.match(fallback.description, /Artist - SAMPLE Vinyl/);
  assert.doesNotMatch(fallback.description, /VINYLLyric/);

  // The product type is not repeated when the title already names it.
  assert.equal(
    productSearchMetadata(product({ title: "Artist - SAMPLE - Vinyl" })).title,
    "Artist - SAMPLE - Vinyl",
  );

  assert.deepEqual(
    productSearchMetadata(
      product({ seo: { title: " Custom ", description: " Written by hand. " } }),
    ),
    { title: "Custom", description: "Written by hand." },
  );
});

test("each variant becomes an offer with its own price and stock", () => {
  const [black, red] = productStructuredData(product()).offers;
  assert.equal(black.price, "30.00");
  assert.equal(black.sku, "LP-BLK");
  assert.equal(black.availability, "https://schema.org/InStock");
  assert.equal(red.price, "35.00");
  assert.equal(red.availability, "https://schema.org/OutOfStock");
  assert.ok(!("sku" in red));
});

test("GODHANDUSA merch is canonical under /godhandusa", () => {
  assert.equal(
    productUrl(product()),
    "https://www.racingthoughtsrecords.com/products/sample-lp",
  );
  assert.equal(
    productUrl(product({ collectionIds: [GODHANDUSA_COLLECTION_ID] })),
    "https://www.racingthoughtsrecords.com/godhandusa/products/sample-lp",
  );
});

test("image alt text pairs Shopify's short caption with the product name", () => {
  assert.equal(productImageAlt(product()), "Artist - SAMPLE - FRONT");
  assert.equal(productImageAlt(product({ imageAltTexts: [null] })), "Artist - SAMPLE");
});

test("merchant text cannot escape a JSON-LD script element", () => {
  const payload = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeStructuredData(payload);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), payload);
});
