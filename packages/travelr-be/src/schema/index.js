const graphql = require('graphql');
const query = require('./query');

const { GraphQLSchema } = graphql;

module.exports = new GraphQLSchema({
  query,
});
