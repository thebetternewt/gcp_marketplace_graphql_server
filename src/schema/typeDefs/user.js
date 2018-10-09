const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    name: String!
    id: ID!
    email: String!
    password: String!
    avatar: String
    admin: Boolean
    dateCreated: String
  }

  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
  }

  extend type Mutation {
    signup(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
    updateUser(
      id: ID!
      name: String
      email: String
      password: String
      admin: Boolean
    ): User!
    removeUser(id: ID!): String
  }
`;
