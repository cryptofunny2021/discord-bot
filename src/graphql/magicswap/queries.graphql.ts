import gql from 'graphql-tag'

export const getPairs = gql`
  query getPairs {
    pairs {
      id
      name
      token0 {
        derivedETH
        id
        name
      }
      token1 {
        derivedETH
        id
        name
      }
    }
  }
`
