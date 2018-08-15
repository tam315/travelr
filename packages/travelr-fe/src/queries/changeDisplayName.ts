import gql from 'graphql-tag';

const query = gql`
  mutation changeDisplayName($userId: String!, $displayName: String!) {
    changeDisplayName(userId: $userId, displayName: $displayName) {
      displayName
    }
  }
`;

export default query;
