import gql from 'graphql-tag'

export const getLatestSales = gql`
  query getLatestSales($collection: String!) {
    sales(
      first: 10
      orderDirection: desc
      orderBy: timestamp
      where: { collection: $collection }
    ) {
      id
      pricePerItem
      timestamp
      token {
        id
        tokenId
      }
    }
  }
`
