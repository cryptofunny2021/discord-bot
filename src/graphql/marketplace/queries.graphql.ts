import gql from 'graphql-tag'

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
`

export const getFloorPrices = gql`
  query getFloorPrices {
    female: listings(
      first: 1
      where: {
        collection: "0x6325439389e0797ab35752b4f43a14c004f22a9c"
        filters_contains: ["Gender,female"]
        status: Active
      }
      orderBy: pricePerItem
    ) {
      pricePerItem
    }
    male: listings(
      first: 1
      where: {
        collection: "0x6325439389e0797ab35752b4f43a14c004f22a9c"
        filters_contains: ["Gender,male"]
        status: Active
      }
      orderBy: pricePerItem
    ) {
      pricePerItem
    }
    land: listings(
      first: 1
      where: {
        collection: "0xd666d1cc3102cd03e07794a61e5f4333b4239f53"
        status: Active
      }
      orderBy: pricePerItem
    ) {
      pricePerItem
    }
    vroom: listings(
      first: 1
      where: {
        collection: "0xb16966dad2b5a5282b99846b23dcdf8c47b6132c"
        status: Active
      }
      orderBy: pricePerItem
    ) {
      pricePerItem
    }
  }
`
