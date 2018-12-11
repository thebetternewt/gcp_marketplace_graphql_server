const { gql } = require('apollo-server');

module.exports = gql`
  type Contribution {
    id: ID!
    title: String!
    description: String
    link: String
    photoUrl: String
    gcp: Boolean
    owner: User
    createdAt: String
    updatedAt: String
    taggedUsers: [User!]!
  }

  extend type Query {
    contribution(id: ID!): Contribution
    contributions(userId: String, limit: Int): [Contribution!]!
  }

  extend type Mutation {
    createContribution(
      title: String!
      description: String
      link: String
      photoUrl: String
      gcp: Boolean
    ): Contribution!
    updateContribution(
      id: ID!
      title: String
      description: String
      link: String
      photoUrl: String
      gcp: Boolean
    ): Contribution!
    deleteContribution(id: ID!): String!
  }
`;
