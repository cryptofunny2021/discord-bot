import gql from "graphql-tag";

export const getHarvesterExtractors = gql`
  query getHarvesterExtractors {
    harvester_extractors {
      boost
      name
      staked
    }
  }
`;
