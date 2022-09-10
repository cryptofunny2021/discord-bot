import gql from 'graphql-tag'

export const getHarvesterExtractorBoosts = gql`
  query getHarvesterExtractorBoosts {
    asiterra: harvester_extractor_aggregate(
      where: { name: { _eq: "Asiterra" } }
    ) {
      aggregate {
        sum {
          boost
          staked
        }
      }
    }
    kameji: harvester_extractor_aggregate(where: { name: { _eq: "Kameji" } }) {
      aggregate {
        sum {
          boost
          staked
        }
      }
    }
    shinoba: harvester_extractor_aggregate(
      where: { name: { _eq: "Shinoba" } }
    ) {
      aggregate {
        sum {
          boost
          staked
        }
      }
    }
  }
`

export const getHarvesterExtractors = gql`
  query getHarvesterExtractors($blockNumber: numeric!) {
    harvester_extractor(
      where: { block_number: { _gt: $blockNumber } }
      order_by: { block_number: desc }
    ) {
      block_number
      boost
      name
      size
      staked
    }
  }
`
