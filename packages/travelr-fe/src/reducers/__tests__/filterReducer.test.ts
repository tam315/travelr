import types from '../../actions/types';
import { DUMMY_FILTER_CRITERION } from '../../config/dummies';
import { difference } from '../../utils/general';
import filterReducer, { INITIAL_STATE } from '../filterReducer';

test('CHANGE_FILTER_CRITERION_SUCCESS', () => {
  const action = {
    type: types.CHANGE_FILTER_CRITERION_SUCCESS,
    payload: {
      criterion: DUMMY_FILTER_CRITERION,
      criterionUntouched: INITIAL_STATE.criterionUntouched,
    },
  };

  const expected = {
    ...INITIAL_STATE,
    criterion: DUMMY_FILTER_CRITERION,
  };

  expect(filterReducer(INITIAL_STATE, action)).toEqual(expected);
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
    criterion: {
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
