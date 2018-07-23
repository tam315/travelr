import types from '../../actions/types';
import { FilterCriterionReduced } from '../../config/types';
import { difference } from '../../utils/general';
import filterReducer, { INITIAL_STATE } from '../filterReducer';
import { DUMMY_FILTER_CRITERION } from '../../config/dummies';

test('CHANGE_FILTER_CRITERION_SUCCESS', () => {
  const criterionReduced: FilterCriterionReduced = {
    displayName: 'dummy',
  };

  const action = {
    type: types.CHANGE_FILTER_CRITERION_SUCCESS,
    payload: criterionReduced,
  };

  const expected = {
    ...INITIAL_STATE,
    criterion: criterionReduced,
  };

  expect(filterReducer(INITIAL_STATE, action)).toEqual(expected);
});

test('CLEAR_FILTER_CRITERION_SUCCESS', () => {
  const originalState = {
    ...INITIAL_STATE,
    criterion: DUMMY_FILTER_CRITERION,
  };
  const action = {
    type: types.CLEAR_FILTER_CRITERION_SUCCESS,
  };

  const expected = {
    ...INITIAL_STATE,
    criterion: {},
  };

  expect(filterReducer(originalState, action)).toEqual(expected);
});

test('GET_FILTER_SELECTOR_RANGE_SUCCESS', () => {
  const DUMMY_PAYLOAD = {
    maxViewCount: 100,
    maxLikedCount: 200,
    maxCommentsCount: 300,
  };

  const action = {
    type: types.GET_FILTER_SELECTOR_RANGE_SUCCESS,
    payload: DUMMY_PAYLOAD,
  };

  const expectedDiff = {
    criterionUntouched: {
      likedCount: {
        max: DUMMY_PAYLOAD.maxLikedCount,
      },
      commentsCount: {
        max: DUMMY_PAYLOAD.maxCommentsCount,
      },
      viewCount: {
        max: DUMMY_PAYLOAD.maxViewCount,
      },
    },
    rangeSetupDone: true,
  };

  const resultState = filterReducer(INITIAL_STATE, action);
  const actualDiff = difference(resultState, INITIAL_STATE);

  // do nothing if the post to fetch is the same with the current post
  expect(actualDiff).toEqual(expectedDiff);
});
