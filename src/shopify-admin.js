import "server-only";

export default class ShopifyAdmin {
  static domain = "p0enpg-gn.myshopify.com";
  static apiVersion = "2026-07";

  static productFields = `
    fragment AdminDraftProductFields on Product {
      id
      title
      handle
      description
      descriptionHtml
      status
      tags
      totalInventory
      priceRangeV2 {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      media(first: 10) {
        edges {
          node {
            ... on MediaImage {
              image {
                url(transform: { maxWidth: 600, maxHeight: 600 })
                altText
              }
            }
          }
        }
      }
      variants(first: 25) {
        edges {
          node {
            id
            title
            price
            availableForSale
          }
        }
      }
    }
  `;

  static getAccessToken() {
    return (
      process.env.SHOPIFY_ADMIN_API_TOKEN ||
      process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
      process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ||
      process.env.SHOPIFY_API_ACCESS_TOKEN ||
      ""
    );
  }

  static getStoreDomain() {
    return ShopifyAdmin.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  static getLegacyResourceId(id) {
    return String(id).split("/").pop();
  }

  static escapeSearchValue(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  }

  static applyStockTags(tags, totalInventory) {
    const result = Array.isArray(tags) ? [...tags] : [];

    if (
      typeof totalInventory === "number" &&
      totalInventory > 0 &&
      totalInventory < 50 &&
      !result.includes("LOWSTOCK")
    ) {
      result.push("LOWSTOCK");
    }

    return result;
  }

  static async request(query, variables) {
    const accessToken = ShopifyAdmin.getAccessToken();

    if (!accessToken) {
      console.warn(
        "SHOPIFY_ADMIN_API_TOKEN is required to fetch Shopify draft products.",
      );
      return null;
    }

    const response = await fetch(
      `https://${ShopifyAdmin.getStoreDomain()}/admin/api/${ShopifyAdmin.apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": accessToken,
        },
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const authHint =
        response.status === 401
          ? " Set SHOPIFY_ADMIN_API_TOKEN to an Admin API access token"
          : "";

      throw new Error(
        `Shopify Admin API request failed: ${response.status}.${authHint}`,
      );
    }

    const payload = await response.json();

    if (payload.errors?.length) {
      throw new Error(
        `Shopify Admin API error: ${payload.errors
          .map((error) => error.message)
          .join("; ")}`,
      );
    }

    return payload.data;
  }

  static parseImages(product) {
    return (product.media?.edges ?? [])
      .map(({ node }) => ({
        url: node.image?.url || "",
        altText: node.image?.altText || "",
      }))
      .filter((image) => image.url);
  }

  static parseProduct(product) {
    const images = ShopifyAdmin.parseImages(product);
    const variants = (product.variants?.edges ?? []).map(({ node }) => ({
      id: node.id,
      title: node.title,
      availableForSale: node.availableForSale,
      price: node.price,
    }));
    const minVariantPrice = product.priceRangeV2?.minVariantPrice;

    return {
      id: product.id,
      handle: product.handle,
      title: product.title,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      tags: ShopifyAdmin.applyStockTags(product.tags, product.totalInventory),
      images: images.map((image) => image.url),
      imageAltTexts: images.map((image) => image.altText),
      price: minVariantPrice?.amount ?? variants[0]?.price ?? "0",
      currencyCode: minVariantPrice?.currencyCode ?? "USD",
      variants,
      soldOut: !variants.some((variant) => variant.availableForSale),
      previewOnly: true,
    };
  }

  static parseCollection(collection) {
    const results = (collection.products?.edges ?? [])
      .map(({ node }) => ShopifyAdmin.parseProduct(node))
      .filter(Boolean);
    const hasMore = collection.products?.pageInfo?.hasNextPage || false;
    const endCursor = collection.products?.pageInfo?.endCursor || null;

    return {
      collection: {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
        descriptionHtml: collection.descriptionHtml,
        image: collection.image?.url || null,
        imageAlt: collection.image?.altText || null,
      },
      products: {
        results,
        hasMore,
        endCursor,
      },
    };
  }

  static async getDraftProductsByCollectionId(
    collectionId,
    first = 100,
    after = null,
  ) {
    const collectionLegacyId = ShopifyAdmin.getLegacyResourceId(collectionId);
    const productsQuery = `collection_id:${collectionLegacyId} AND status:draft`;
    const data = await ShopifyAdmin.request(
      `
        query AdminDraftProductsByCollectionQuery(
          $collectionId: ID!
          $productsQuery: String!
          $first: Int!
          $after: String
        ) {
          collection(id: $collectionId) {
            id
            title
            handle
            description
            descriptionHtml
            image {
              url
              altText
            }
          }
          products(first: $first, after: $after, query: $productsQuery) {
            pageInfo {
              hasNextPage
              endCursor
            }
            edges {
              node {
                ...AdminDraftProductFields
              }
            }
          }
        }

        ${ShopifyAdmin.productFields}
      `,
      { collectionId, productsQuery, first, after },
    );

    if (!data?.collection || !data?.products) {
      return null;
    }

    return ShopifyAdmin.parseCollection({
      ...data.collection,
      products: data.products,
    });
  }

  static async getDraftProductByHandle(handle, collectionId) {
    const collectionLegacyId = ShopifyAdmin.getLegacyResourceId(collectionId);
    const productsQuery = [
      `handle:"${ShopifyAdmin.escapeSearchValue(handle)}"`,
      `collection_id:${collectionLegacyId}`,
      "status:draft",
    ].join(" AND ");

    const data = await ShopifyAdmin.request(
      `
        query AdminDraftProductByHandleQuery($productsQuery: String!) {
          products(first: 1, query: $productsQuery) {
            edges {
              node {
                ...AdminDraftProductFields
              }
            }
          }
        }

        ${ShopifyAdmin.productFields}
      `,
      { productsQuery },
    );

    const product = data?.products?.edges?.[0]?.node;

    return product ? ShopifyAdmin.parseProduct(product) : null;
  }
}
