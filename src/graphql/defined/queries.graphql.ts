import gql from "graphql-tag";

export const getMagicPrice = gql`
  query getMagicPrice {
    pairMetadata(pairId: "0xb7e50106a5bd3cf21af210a755f9c8740890a8c9:42161") {
      price
      priceChange
    }
  }
`;
