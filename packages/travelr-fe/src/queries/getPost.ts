import gql from 'graphql-tag';

const query = gql`
  query GetPost($postId: Int!, $userId: String) {
    post(postId: $postId, userId: $userId) {
      postId
      userId
      oldImageUrl
      newImageUrl
      description
      shootDate
      lng
      lat
      viewCount
      createdAt
      likedCount
      commentsCount
      likeStatus
      user {
        displayName
      }
      comments {
        commentId
        userId
        postId
        datetime
        comment
        user {
          displayName
        }
      }
    }
  }
`;

export default query;
