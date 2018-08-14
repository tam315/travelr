const getQueryStringByFlattenCriterion = flattenCriterion => {
  const {
    displayName,
    description,
    minDate,
    maxDate,
    lng,
    lat,
    radius,
    minViewCount,
    maxViewCount,
    minLikedCount,
    maxLikedCount,
    minCommentsCount,
    maxCommentsCount,
  } = flattenCriterion;

  const params = [];

  if (displayName) params.push(`display_name=${displayName}`);
  if (description) params.push(`description=${description}`);
  if (minDate) params.push(`min_date=${minDate}-01-01`);
  if (maxDate) params.push(`max_date=${maxDate}-12-31`);
  if (lng) params.push(`lng=${lng}`);
  if (lat) params.push(`lat=${lat}`);
  if (radius) params.push(`radius=${radius}`);
  if (minViewCount) params.push(`min_view_count=${minViewCount}`);
  if (maxViewCount) params.push(`max_view_count=${maxViewCount}`);
  if (minLikedCount) params.push(`min_liked_count=${minLikedCount}`);
  if (maxLikedCount) params.push(`max_liked_count=${maxLikedCount}`);
  if (minCommentsCount) {
    params.push(`min_comments_count=${minCommentsCount}`);
  }
  if (maxCommentsCount) {
    params.push(`max_comments_count=${maxCommentsCount}`);
  }

  let queryParams = '';
  if (params.length) queryParams = `?${params.join('&')}`;

  return queryParams;
};

module.exports = {
  getQueryStringByFlattenCriterion,
};
