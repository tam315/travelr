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

export default query;
