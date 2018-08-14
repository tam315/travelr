/* Root Query */

const graphql = require('graphql');
const axios = require('axios');

const config = require('../../config');
const types = require('./types');
const utils = require('../utils');

const { getQueryStringByFlattenCriterion } = utils;

const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLNonNull,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    post: {
      type: types.PostType,
      args: {
        postId: { type: GraphQLNonNull(GraphQLInt) },
        userId: { type: GraphQLString },
      },
      resolve(parentValue, { postId, userId }) {
        let url;
        if (userId) {
          url = `${config.apiUrl}posts/${postId}?user_id=${userId}`;
        } else {
          url = `${config.apiUrl}posts/${postId}`;
        }
        return axios.get(url).then(res => res.data);
      },
    },
    posts: {
      type: GraphQLList(types.PostType),
      args: {
        displayName: { type: GraphQLString },
        description: { type: GraphQLString },
        minDate: { type: GraphQLInt },
        maxDate: { type: GraphQLInt },
        lng: { type: GraphQLFloat },
        lat: { type: GraphQLFloat },
        radius: { type: GraphQLInt },
        minViewCount: { type: GraphQLInt },
        maxViewCount: { type: GraphQLInt },
        minLikedCount: { type: GraphQLInt },
        maxLikedCount: { type: GraphQLInt },
        minCommentsCount: { type: GraphQLInt },
        maxCommentsCount: { type: GraphQLInt },
      },
      resolve(parentValue, args) {
        const queryParams = getQueryStringByFlattenCriterion(args);

        return axios
          .get(`${config.apiUrl}posts${queryParams}`)
          .then(res => res.data);
      },
    },
    user: {
      type: types.UserType,
      args: {
        userId: { type: GraphQLString },
      },
      resolve(parentValue, { userId }) {
        return axios
          .get(`${config.apiUrl}users/${userId}`)
          .then(res => res.data);
      },
    },
  },
});

module.exports = RootQuery;
