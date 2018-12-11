const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
    admin: Boolean
    profile: Profile
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    me: User
    user(id: ID!): User
    users(limit: Int): [User!]!
  }

  extend type Mutation {
    signup(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    updateUser(
      id: ID!
      name: String
      email: String
      password: String
      admin: Boolean
    ): User!
    deleteUser(id: ID!): String!
  }
`;
