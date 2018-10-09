const { gql } = require('apollo-server');

module.exports = gql`
  type Skill {
    id: ID!
    name: String!
    profiles: [Profile]
  }

  extend type Query {
    skill(id: ID!): Skill
    skills(searchTerm: String): [Skill!]!
  }

  extend type Mutation {
    createSkill(name: String!): Skill!
    deleteSkill(id: ID!): Skill!
  }
`;
