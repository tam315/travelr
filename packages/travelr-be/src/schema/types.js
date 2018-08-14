const graphql = require('graphql');
const axios = require('axios');
const config = require('../../config');

const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLBoolean,
} = graphql;

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    postId: { type: GraphQLInt },
    userId: { type: GraphQLString },
    oldImageUrl: { type: GraphQLString },
    newImageUrl: { type: GraphQLString },
    description: { type: GraphQLString },
    shootDate: { type: GraphQLString },
    lng: { type: GraphQLFloat },
    lat: { type: GraphQLFloat },
    viewCount: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    likedCount: { type: GraphQLInt },
    commentsCount: { type: GraphQLInt },
    likeStatus: { type: GraphQLBoolean },
    user: {
      // eslint-disable-next-line
      type: UserType,
      resolve(parentValue) {
        return axios
          .get(`${config.apiUrl}users/${parentValue.userId}`)
          .then(res => res.data);
      },
    },
    comments: {
      // eslint-disable-next-line
      type: GraphQLList(CommentType),
      resolve(parentValue) {
        return axios
          .get(`${config.apiUrl}posts/${parentValue.postId}/comments`)
          .then(res => res.data);
      },
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    commentId: { type: GraphQLInt },
    postId: { type: GraphQLInt },
    userId: { type: GraphQLString },
    datetime: { type: GraphQLString },
    comment: { type: GraphQLString },
    user: {
      // eslint-disable-next-line
      type: UserType,
      resolve(parentValue) {
        return axios
          .get(`${config.apiUrl}users/${parentValue.userId}`)
          .then(res => res.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    userId: { type: GraphQLString },
    displayName: { type: GraphQLString },
    earnedLikes: { type: GraphQLInt },
    earnedComments: { type: GraphQLInt },
    earnedViews: { type: GraphQLInt },
  }),
});

module.exports = {
  PostType,
  CommentType,
};
