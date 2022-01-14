import gql from "graphql-tag";

export const getRocketSnapshot = gql`
  query getRocketSnapshot($where: Boarded_filter) {
    boardeds(first: 1000, orderBy: id, orderDirection: asc, where: $where) {
      id
      token {
        owners {
          user {
            id
          }
        }
      }
    }
  }
`;

export const getTokenSnapshot = gql`
  query getTokenSnapshot($where: Token_filter) {
    tokens(
      first: 1000
      orderBy: id
      orderDirection: asc
      where: $where
    ) {
      id
      owners {
        user {
          id
        }
      }
    }
  }
`;
