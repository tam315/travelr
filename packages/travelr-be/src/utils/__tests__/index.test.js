const utils = require('..');

const { getQueryStringByFlattenCriterion } = utils;

const flattenCriterion = {
  displayName: '1',
  description: '2',
  minDate: 3,
  maxDate: 4,
  lng: 5,
  lat: 6,
  radius: '7',
  minViewCount: 8,
  maxViewCount: 9,
  minLikedCount: 10,
  maxLikedCount: 11,
  minCommentsCount: 12,
  maxCommentsCount: 13,
};

test('return nothing if the criterion is empty', () => {
  const result = getQueryStringByFlattenCriterion({});

  expect(result).toBe('');
});

test('return correct query string', () => {
  const result = getQueryStringByFlattenCriterion(flattenCriterion);
  expect(result).toContain(
    '?' +
      `display_name=${flattenCriterion.displayName}` +
      `&description=${flattenCriterion.description}` +
      `&min_date=${flattenCriterion.minDate}-01-01` +
      `&max_date=${flattenCriterion.maxDate}-12-31` +
      `&lng=${flattenCriterion.lng}` +
      `&lat=${flattenCriterion.lat}` +
      `&radius=${flattenCriterion.radius}` +
      `&min_view_count=${flattenCriterion.minViewCount}` +
      `&max_view_count=${flattenCriterion.maxViewCount}` +
      `&min_liked_count=${flattenCriterion.minLikedCount}` +
      `&max_liked_count=${flattenCriterion.maxLikedCount}` +
      `&min_comments_count=${flattenCriterion.minCommentsCount}` +
      `&max_comments_count=${flattenCriterion.maxCommentsCount}`,
  );
});
