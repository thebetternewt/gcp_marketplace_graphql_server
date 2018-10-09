const { gql } = require('apollo-server');

module.exports = gql`
  type Profile {
    id: ID!
    handle: String!
    bio: String
    skills: [Skill]
    website: String
    location: String
    socialLinks: [SocialLink!]!
    user: User
    createdAt: String
    updatedAt: String
  }

  input SocialLinkInput {
    name: String!
    url: String!
  }

  type SocialLink {
    name: String!
    url: String!
  }

  extend type Query {
    current: Profile
    profile(handle: String!): Profile
    profiles(limit: Int): [Profile!]!
  }

  extend type Mutation {
    createProfile(
      handle: String!
      bio: String
      skills: [String!]
      website: String
      location: String
      socialLinks: [SocialLinkInput]
    ): Profile!
    updateProfile(
      id: ID!
      handle: String
      bio: String
      skills: [String!]
      website: String
      location: String
      socialLinks: [SocialLinkInput]
    ): Profile!
    deleteProfile(id: ID!): String!
  }
`;
