import gql from "graphql-tag";

export const getSmolDetails = gql`
  query GetSmolDetails($tokenId: BigInt!) {
    collection(id: "0x6325439389e0797ab35752b4f43a14c004f22a9c") {
      id
      tokens(where: { tokenId: $tokenId }) {
        listings(where: { status: Active }) {
          pricePerItem
          expires
        }
        metadata {
          attributes {
            attribute {
              name
              percentage
              value
            }
          }
          image
        }
        tokenId
        owner {
          id
        }
        rank
      }
      last: tokens(first: 1, orderBy: rank, orderDirection: desc) {
        rank
      }
    }
  }
`;
