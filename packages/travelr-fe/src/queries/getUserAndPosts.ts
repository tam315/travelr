import gql from 'graphql-tag';

const query = gql`
  query getUserAndPosts($userId: String!) {
    user(userId: $userId) {
      posts {
        postId
        oldImageUrl
        newImageUrl
        likedCount
        commentsCount
        viewCount
      }
    }
  }
`;

// vanilla query string should be exported
// as gql is only used for formatting
export default query.loc.source.body;
