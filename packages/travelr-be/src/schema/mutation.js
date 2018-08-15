const graphql = require('graphql');
const axios = require('axios');
const config = require('../../config');

const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = graphql;
const types = require('./types');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    changeDisplayName: {
      type: types.UserType,
      args: {
        userId: { type: GraphQLNonNull(GraphQLString) },
        displayName: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { userId, displayName }, req) {
        const { authorization } = req.headers;
        const axiosConfig = {
          headers: { authorization },
        };
        return axios
          .put(`${config.apiUrl}users/${userId}`, { displayName }, axiosConfig)
          .then(() => axios.get(`${config.apiUrl}users/${userId}`))
          .then(res => res.data);
      },
    },
  },
});

module.exports = mutation;
