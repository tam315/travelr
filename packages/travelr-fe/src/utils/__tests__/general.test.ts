import { DUMMY_FILTER_CRITERION } from '../../config/dummies';
import { getPositionFromPlaceName } from '../../utils/mapsUtils';
import { flattenCriterion } from '../general';

jest.mock('../../utils/mapsUtils');

describe('flattenCriterion()', () => {
  const DUMMY_LAT_LNG = { lng: 1, lat: 2 };
  // @ts-ignore
  getPositionFromPlaceName.mockResolvedValue(DUMMY_LAT_LNG);

  test('return nothing if the criterion is empty', async () => {
    const result = await flattenCriterion({});
    expect(Object.keys(result).length).toBe(0);
  });

  test('return flatten criterion', async () => {
    const result = await flattenCriterion(DUMMY_FILTER_CRITERION);

    expect(result.displayName).toBe(DUMMY_FILTER_CRITERION.displayName);
    expect(result.description).toBe(DUMMY_FILTER_CRITERION.description);
    expect(result.minDate).toBe(DUMMY_FILTER_CRITERION.shootDate.min);
    expect(result.maxDate).toBe(DUMMY_FILTER_CRITERION.shootDate.max);
    expect(result.lng).toBe(DUMMY_LAT_LNG.lng);
    expect(result.lat).toBe(DUMMY_LAT_LNG.lat);
    expect(result.radius).toBe(DUMMY_FILTER_CRITERION.radius);
    expect(result.minViewCount).toBe(DUMMY_FILTER_CRITERION.viewCount.min);
    expect(result.maxViewCount).toBe(DUMMY_FILTER_CRITERION.viewCount.max);
    expect(result.minLikedCount).toBe(DUMMY_FILTER_CRITERION.likedCount.min);
    expect(result.maxLikedCount).toBe(DUMMY_FILTER_CRITERION.likedCount.max);
    expect(result.minCommentsCount).toBe(
      DUMMY_FILTER_CRITERION.commentsCount.min,
    );
    expect(result.maxCommentsCount).toBe(
      DUMMY_FILTER_CRITERION.commentsCount.max,
    );
  });
});
