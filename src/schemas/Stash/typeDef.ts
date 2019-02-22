import { gql } from 'apollo-server';

export interface QueryStashForMonth {
  date: string;
}

export default gql`
  type Stash {
    total: Int
    months: JSON
  }

  extend type Query {
    stash(date: String): Stash

    monthlyStash(date: String!): Int
  }
`;
