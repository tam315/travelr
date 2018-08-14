import gql from 'graphql-tag';

const query = gql`
  query GetPosts(
    # same as type FilterCriterionFlatten
    $displayName: String
    $description: String
    $minDate: Int
    $maxDate: Int
    $lng: Float
    $lat: Float
    $radius: Int
    $minViewCount: Int
    $maxViewCount: Int
    $minLikedCount: Int
    $maxLikedCount: Int
    $minCommentsCount: Int
    $maxCommentsCount: Int
  ) {
    posts(
      displayName: $displayName
      description: $description
      minDate: $minDate
      maxDate: $maxDate
      lng: $lng
      lat: $lat
      radius: $radius
      minViewCount: $minViewCount
      maxViewCount: $maxViewCount
      minLikedCount: $minLikedCount
      maxLikedCount: $maxLikedCount
      minCommentsCount: $minCommentsCount
      maxCommentsCount: $maxCommentsCount
    ) {
      postId
      oldImageUrl
      newImageUrl
      lng
      lat
      likedCount
    }
  }
`;

// vanilla query string should be exported
// as gql is only used for formatting
export default query.loc.source.body;
