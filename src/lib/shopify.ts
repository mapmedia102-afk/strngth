import { GraphQLClient } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || "glocasaglasswear.myshopify.com";
const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "YOUR_STOREFRONT_TOKEN";

export const shopify = new GraphQLClient(
  `https://${domain}/api/2024-04/graphql.json`,
  {
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
  }
);

// Queries
export const GET_PRODUCTS = `
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        description
        productType
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges { node { src url altText } }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}`;

export const GET_PRODUCT = `
query GetProduct($id: ID!) {
  product(id: $id) {
    id
    title
    description
    priceRange { minVariantPrice { amount currencyCode } }
    images(first: 5) { edges { node { src altText } } }
  }
}`;
