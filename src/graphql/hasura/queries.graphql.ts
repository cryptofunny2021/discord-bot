import gql from 'graphql-tag'

export const getCurrentCorruptionCrypt = gql`
  query getCurrentCorruptionCrypt {
    corruption_crypt(order_by: { round: desc }, limit: 1) {
      reached
      round
      start_timestamp
    }
  }
`

export const getHarvesterExtractorBoosts = gql`
  query getHarvesterExtractorBoosts {
    harvester_extractor_active {
      boost
      name
    }
  }
`

export const getHarvesterExtractors = gql`
  query getHarvesterExtractors($vid: bigint!) {
    harvester_extractor_active(
      where: { vid: { _gt: $vid } }
      order_by: { vid: desc }
    ) {
      name
      size
      vid
    }
  }
`
