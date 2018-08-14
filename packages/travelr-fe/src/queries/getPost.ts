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

// vanilla query string should be exported
// as gql is only used for formatting
export default query.loc.source.body;
