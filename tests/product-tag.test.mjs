import assert from "node:assert/strict";
import { test } from "node:test";
import { getCompareAtPrice, getProductTag } from "../src/utils.js";

test("an explicit SALE tag takes priority over low stock", () => {
  const tag = getProductTag({ tags: ["LOWSTOCK", "SALE"], variants: [] });
  assert.equal(tag.id, "SALE");
});

test("a markdown applies only when an available variant beats its own compare-at price", () => {
  const product = {
    tags: ["LOWSTOCK"],
    variants: [
      { availableForSale: true, price: "8.00", compareAtPrice: null },
      { availableForSale: true, price: "12.00", compareAtPrice: "12.00" },
      { availableForSale: false, price: "9.99", compareAtPrice: "12.00" },
    ],
  };

  assert.equal(getProductTag(product).id, "LOWSTOCK");
  product.variants[2].availableForSale = true;
  assert.equal(getProductTag(product).id, "SALE");
});

test("the crossed out price comes from the marked down variant at the displayed price", () => {
  const product = {
    variants: [
      { availableForSale: true, price: "20.00", compareAtPrice: "30.00" },
      { availableForSale: true, price: "10.00", compareAtPrice: null },
      { availableForSale: false, price: "10.00", compareAtPrice: "15.00" },
    ],
  };

  assert.equal(getCompareAtPrice(product), null);
  product.variants[2].availableForSale = true;
  assert.equal(getCompareAtPrice(product), 15);
});
