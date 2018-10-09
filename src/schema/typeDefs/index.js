/* eslint-disable global-require */
const { gql } = require('apollo-server');

const base = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }
`;

module.exports = [
  base,
  require('./user'),
  require('./profile'),
  require('./skill'),
  require('./contribution'),
];
