import gql from 'graphql-tag'

export const getArbPrice = gql`
  query getArbPrice {
    pair(id: "0x338b50b05f1300439a3ce80e6fbaa613051b3349") {
      token1Price
    }
  }
`
