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

export const getBodiesSnapshot = gql`
  query getBodiesSnapshot($where: Token_filter) {
    tokens(
      block: { number: 4435095 }
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
