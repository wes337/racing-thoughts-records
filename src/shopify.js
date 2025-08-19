import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import Cache from "./cache.js";

export default class Shopify {
  static client;
  static domain = "small-dark-one.myshopify.com";
  static storefrontAccessToken = "a65abf60d3c4203455843d672e0ac212";

  static {
    Shopify.client = createStorefrontApiClient({
      apiVersion: "2025-07",
      storeDomain: Shopify.domain,
      publicAccessToken: Shopify.storefrontAccessToken,
    });
  }

  static async getCollections() {
    const cachedCollections = await Cache.getItem("collections");

    if (cachedCollections) {
      return cachedCollections;
    }

    const { data } = await Shopify.client.request(
      `query CollectionsQuery {
      collections(first: 250) {
        edges {
          node {
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
        }
      }
    }`
    );

    const collections = data.collections.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      descriptionHtml: node.descriptionHtml,
      image: node.image?.url || "",
      imageAlt: node.image?.altText || "",
    }));

    if (collections && collections.length > 0) {
      Cache.setItem("collections", collections, 120);
    }

    return collections;
  }

  static async getProduct(handle) {
    const cachedProduct = await Cache.getItem(`product:${handle}`);

    if (cachedProduct) {
      return cachedProduct;
    }

    const { data } = await Shopify.client.request(
      `query ProductQuery($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }`,
      {
        variables: { handle },
      }
    );

    const product = {
      id: data.product.id,
      handle: data.product.handle,
      title: data.product.title,
      description: data.product.description,
      descriptionHtml: data.product.descriptionHtml,
      images:
        data.product.images?.edges?.length > 0
          ? data.product.images.edges.map(({ node }) => node.url || "")
          : [],
      soldOut: !data.product.variants.edges.some(
        ({ node }) => node.availableForSale
      ),
      price: `$${Number(data.product.priceRange.minVariantPrice.amount).toFixed(
        2
      )}`,
      currencyCode: data.product.priceRange.minVariantPrice.currencyCode,
      variants:
        data.product.variants?.edges?.length > 0
          ? data.product.variants.edges.map(({ node }) => ({
              id: node.id,
              title: node.title,
              availableForSale: node.availableForSale,
            }))
          : [],
    };

    if (product) {
      Cache.setItem(`product:${handle}`, product, 60);
    }

    return product;
  }

  static async getProducts(first = 100, after = null) {
    const cachedProducts = await Cache.getItem(
      `products:${first}${after ? `:${after}` : ""}`
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const { data } = await Shopify.client.request(
      `query ProductsQuery($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              collections(first: 250) {
                edges {
                  node {
                    id
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { first, after },
      }
    );

    const results = data.products.edges
      .map(({ node }) => {
        const images =
          node.images?.edges?.length > 0
            ? node.images.edges.map(({ node }) => node.url || "")
            : [];

        const soldOut = !node.variants.edges.some(
          ({ node }) => node.availableForSale
        );

        // For testing purposes, remove this later
        const collectionIds =
          node.collections?.edges?.length > 0
            ? node.collections.edges.map(({ node }) => node.id)
            : [];

        const testProduct = collectionIds.some(
          (collectionId) =>
            collectionId === "gid://shopify/Collection/441026969915"
        );

        if (!testProduct) {
          return null;
        }

        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          descriptionHtml: node.descriptionHtml,
          images,
          price: node.priceRange.minVariantPrice.amount,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          variants:
            node.variants?.edges?.length > 0
              ? node.variants.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  availableForSale: node.availableForSale,
                  price: node.price.amount,
                }))
              : [],
          soldOut,
        };
      })
      .filter(Boolean);

    const hasMore = data.products.pageInfo?.hasNextPage || false;

    const products = {
      results,
      hasMore,
    };

    if (products && products.results && products.results.length > 0) {
      Cache.setItem(
        `products:${first}${after ? `:${after}` : ""}`,
        products,
        120
      );
    }

    return products;
  }

  static async getCart(cartId) {
    const { data } = await Shopify.client.request(
      `query CartQuery($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { cartId },
      }
    );

    return data.cart;
  }

  static async isCartValid(cartId) {
    try {
      const { data } = await Shopify.client.request(
        `query CartQuery($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
          }
        }`,
        {
          variables: { cartId },
        }
      );

      return !!(data && data.cart && data.cart.id);
    } catch {
      return false;
    }
  }

  static async createCart() {
    const { data } = await Shopify.client.request(`
      mutation CreateCart {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `);

    return data.cartCreate.cart;
  }

  static async buyItNow(lines) {
    const cart = await Shopify.createCart();
    const updatedCart = await Shopify.addToCart(cart.id, lines);
    window.location.href = updatedCart.checkoutUrl;
  }

  static async addToCart(cartId, lines) {
    const { data } = await Shopify.client.request(
      `mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lines },
      }
    );

    Cache.setItem("cartId", cartId, 180);

    return data.cartLinesAdd.cart;
  }

  static async removeFromCart(cartId, lineIds) {
    const { data } = await Shopify.client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lineIds },
      }
    );

    return data.cartLinesRemove.cart;
  }

  static async updateQuantity(cartId, lineId, quantity) {
    const { data } = await Shopify.client.request(
      `mutation UpdateCartLineQuantity($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          cartId,
          lines: [{ id: lineId, quantity }],
        },
      }
    );

    return data.cartLinesUpdate.cart;
  }

  static async emptyCart(cart) {
    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return;
    }

    const lineIds = cart.lines.edges.map((edge) => edge.node.id);

    await Shopify.client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId: cart.id, lineIds },
      }
    );
  }

  static async getCartItems(cartId) {
    const cart = await Shopify.getCart(cartId);

    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return [];
    }

    return cart.lines.edges.map(({ node }) => {
      const merchandise = node.merchandise;

      return {
        id: node.id,
        quantity: node.quantity,
        variantId: merchandise.id,
        variantTitle: merchandise.title,
        productTitle: merchandise.product.title,
        productHandle: merchandise.product.handle,
        price: merchandise.price.amount,
        image: merchandise.image?.url || "",
      };
    });
  }
}
