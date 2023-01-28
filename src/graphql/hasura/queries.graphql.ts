import gql from 'graphql-tag'

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
