const graphql = require('graphql');
const query = require('./query');
const mutation = require('./mutation');

const { GraphQLSchema } = graphql;

module.exports = new GraphQLSchema({
  query,
  mutation,
});
